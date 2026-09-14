// Importamos el módulo fs/promises para trabajar con archivos de manera asíncrona
const fs = require("node:fs/promises");
// Función para leer un archivo JSON y devolver su contenido como un objeto JavaScript
async function leerJson(ruta) {
// Leemos el contenido del archivo en formato UTF-8
const contenido = await fs.readFile(ruta, "utf8");
// Convertimos el contenido JSON a un objeto JavaScript y lo devolvemos
return JSON.parse(contenido);
}
// Función para escribir un objeto JavaScript en un archivo JSON
async function escribirJson(ruta, datos) {
// Convertimos el objeto JavaScript a una cadena JSON con formato legible
  try {
    const data = JSON.stringify(datos, null, 2);
    // Escribimos la cadena JSON en el archivo especificado
    await fs.writeFile(ruta, data, 'utf-8');
  // Mostramos un mensaje de éxito en la consola
    console.log('Archivo escrito exitosamente');
    
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
  }
}
// Exportar la función para que pueda ser utilizada en otros archivos//
    
module.exports = { leerJson, escribirJson };    