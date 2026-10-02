const express = require("express");
const expressLayouts = require("express-ejs-layouts");
 // Base de datos en memoria y constantes de dominio
const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const morgan = require("morgan");
const path = require("node:path");
const { leerJson } = require("./archivos");
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "reservas.json");
let numeroDeSolicitud = 0;

function identificarSolicitud(req, res, next) {
  numeroDeSolicitud += 1;
  res.locals.solicitudId = `SOL-${String(numeroDeSolicitud).padStart(4, "0")}`;
  next();
}
function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();
  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const milisegundos = Number(fin - inicio) / 1_000_000;
    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${milisegundos.toFixed(2)} ms`,
    );
  });
  next();
}

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas Alojamiento";
  next();
}

function validarReservas(req, res, next) {
 
  const estudiante = String(req.body.estudiante ?? "").trim();
  const email = String(req.body.email ?? "").trim();
  const sala = String(req.body.sala ?? "").trim();
  const fecha = String(req.body.fecha ?? "").trim();
  const turno = String(req.body.turno ?? "").trim();
  const personas = Number(req.body.personas ?? 0);
  
   // 1. Comprobar campos obligatorios y que personas sea un entero entre 1 y 6
  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: "Completá todos los campos con valores válidos (personas debe ser de 1 a 6).",
      valores: req.body,
    });
  }
  // Comprobar email con @
  if (!email.includes("@")) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: "El correo debe incluir un '@'.",
      valores: req.body,
      salasPermitidas,
      turnosPermitidos
    });
  }

  // Comprobar sala y turno
  if (!salasPermitidas.includes(sala) || !turnosPermitidos.includes(turno)) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: "La sala o el turno no son válidos.",
      valores: req.body,
      salasPermitidas,
      turnosPermitidos
    });
  }

  req.reservaValidada = { 
    
    estudiante, 
    email, 
    sala, 
    fecha, 
    turno, 
    personas 
  };

  next();
}

async function main() {
  const reservas = await leerJson(rutaDatos);
  const app = express();

  function crearReservas(req, res) {
    const ultimoId = reservas.reduce(
      (mayorId, reservas) => Math.max(mayorId, reservas.id),
      0,
    );
    reservas.push({ id: ultimoId + 1, ...req.reservaValidada });
    res.redirect("/reservas?creado=true");
   
  }

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");
  app.use(morgan("dev"));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Sistema de Reservas" });
  });
  app.get("/api/reservas", (req, res) => {
    res.json(reservas);
  });

  const reservasRouter = express.Router();
  reservasRouter.use(prepararAreaReservas);
  reservasRouter.get("/", (req, res) => {
    res.render("reservas/lista", {
      titulo: "Reservas Registradas",
      reservas,
    });
  });
  reservasRouter.get("/nueva", (req, res) => {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: null,
      valores: {},
    });
  });

  reservasRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const reserva = reservas.find((elemento) => elemento.id === id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrado",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    res.render("reservas/detalle", {
      titulo: reserva.id,
      reserva, 
    });
  });

  reservasRouter.post("/", validarReservas, crearReservas);
  app.use("/reservas", reservasRouter);
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });
  app.listen(PORT, () => {
    console.log(`Aplicación disponible en http://localhost:${PORT}`);
  });
}
main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);
  process.exitCode = 1;
});
