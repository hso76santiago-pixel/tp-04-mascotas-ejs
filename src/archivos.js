// Importamos el módulo fs/promises para trabajar con archivos de manera asíncrona
const fs = require("node:fs/promises");
// Función para leer un archivo JSON y devolver su contenido como un objeto JavaScript
async function leerJson(ruta) {
// Leemos el contenido del archivo en formato UTF-8
const contenido = await fs.readFile(ruta, "utf8");
// Convertimos el contenido JSON a un objeto JavaScript y lo devolvemos
return JSON.parse(contenido);
}

module.exports = { leerJson};    