// Importamos los módulos necesarios para crear un servidor web con Express y trabajar con rutas de archivos
const express = require("express");
const path = require("node:path");
// Importamos las funciones leerJson y escribirJson desde el archivo archivos.js para manejar la lectura y escritura de archivos JSON
const { leerJson, escribirJson} = require("./archivos");
const expressLayouts = require("express-ejs-layouts");
// Definimos el puerto en el que se ejecutará la aplicación y la ruta del archivo JSON que contiene los datos de las mascotas
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");
// Función principal que inicializa la aplicación
async function main() {
  const mascotas = await leerJson(rutaDatos);
  const app = express();
// Configuramos la aplicación para usar EJS como motor de plantillas y establecer la carpeta de vistas y el layout principal
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  app.use(express.static(path.join(__dirname, "..", "public")));

  // incorporo esta linea para poder recibir datos de formularios en formato x-www-form-urlencoded//
  app.use(express.urlencoded({ extended: false }));
  // Definimos las rutas de la aplicación para manejar las solicitudes HTTP y renderizar las vistas correspondientes
  app.get("/api/mascotas", (req, res) => {
    res.json(mascotas);
  });
// Definimos la ruta raíz que renderiza la vista de inicio con el título y la lista de mascotas
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Mercado de Mascotas", mascotas: mascotas });
  });
// Definimos la ruta para mostrar la lista de mascotas, la ruta para crear una nueva mascota y la ruta para mostrar los detalles de una mascota específica según su ID
  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      titulo: "Mascotas",
      mascotas: mascotas,
    });
  });

  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      titulo: "Nueva mascota",
      error: null,
      valores: {},
    });
  });
// Definimos la ruta para mostrar los detalles de una mascota específica según su ID, y si no se encuentra, renderizamos una vista de error con un mensaje adecuado
  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);

    const mascota = mascotas.find((mascota) => mascota.id === id);
    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        titulo: "Mascota no encontrada",
        mensaje: "No existe una mascota con ese identificador.",
      });
    }
    // Si se encuentra la mascota, renderizamos la vista de detalle con la información correspondiente
    res.render("mascotas/detalle", {
      titulo: mascota.nombre,
      mascota,
    });
  });
  // Definimos la ruta para manejar la creación de una nueva mascota mediante una solicitud POST, validando los datos recibidos y guardándolos en el archivo JSON y en el arreglo de mascotas
  // ruta para crear una nueva mascota
app.post("/mascotas", (req, res) => {
  const { nombre, especie, precio, edad, descripcion, imagen } = req.body;

  const nombreLimpio = String(nombre ?? "").trim();
  const especieLimpia = String(especie ?? "").trim();
  const precioLimpio = Number(precio ?? 0);
  const edadLimpia = String(edad ?? "").trim();
  const descripcionLimpia = String(descripcion ?? "").trim();
  
  // Si no viene imagen, se asigna una por defecto o string vacío
  const imagenLimpia = String(imagen ?? "marca.svg").trim();

  // ¿ que se realizo para que funcione el código? se Quito !imagenLimpia del chequeo de obligatorios
  if (!nombreLimpio || !especieLimpia || !precioLimpio || !edadLimpia || !descripcionLimpia) {
    return res.status(400).render("mascotas/nueva", {
      titulo: "Nueva mascota",
      error: "Completá todos los campos con valores válidos.",
      valores: req.body,
    });
  }
// Calculamos el último ID de las mascotas existentes para asignar un nuevo ID a la mascota que se va a crear
  const ultimoId = mascotas.reduce(
    (mayorId, mascota) => Math.max(mayorId, mascota.id),
    0
  );

  // aqui complete el resto del código para guardar la mascota

  // comentario de recuerdo: se Guardo la nueva mascota en el arreglo y se  escribimos en el archivo JSON
  escribirJson(rutaDatos, [...mascotas, {
    id: ultimoId + 1,
    nombre: nombreLimpio,
    especie: especieLimpia,
    precio: precioLimpio, 
    edad: edadLimpia,
    descripcion: descripcionLimpia,
    imagen: imagenLimpia, 
      
   }]);
//que hace pusch? push agrega un nuevo elemento al final del arreglo. En este caso, se está agregando un objeto que representa una nueva mascota con sus propiedades (id, nombre, especie, precio, edad, descripcion e imagen) al arreglo de mascotas existente. Esto permite que la nueva mascota se incluya en la lista de mascotas y se pueda acceder a ella posteriormente.
    mascotas.push({
      id: ultimoId + 1,
      nombre: nombreLimpio,
      especie: especieLimpia,
      precio: precioLimpio,
      edad: edadLimpia,
      descripcion: descripcionLimpia,
      imagen: imagenLimpia,
    });

    // Redirigimos al usuario a la lista de mascotas después de guardar la nueva mascota
    res.redirect("/mascotas");
  });

  app.listen(PORT, () => {
    console.log(`Aplicación disponible en http://localhost:${PORT}`);
  });
}
// llamo a la función main para iniciar la aplicación
main();
