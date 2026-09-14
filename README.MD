ALUMNO: Héctor Santiago Orellana Gonzalez
# Nombre del Proyecto:
Trabajo práctico 04 - Aplicación web con EJS
# Descripción: 
Creación de una aplicación web para consultar mascotas en adopción y agregar temporalmente nuevos registros
mediante un formulario.
# Principales Caracteristicas:
Instalación y Configuración
-- datos iniciales desde JSON
-- npm init -y
-- npm install express ejs express-ejs-layouts
-- Configuración de Express y EJS
-- parciales de encabezado y pie 
-- página inicial;
-- listado y estado vacío;
-- detalle y página HTML 404 ;
-- formulario con validación mínima;
-- recursos estáticos;
-- creación en memoria y redirección.
# Diferencia entre Layout, Vista y Parcial
Layout (Diseño general): Es la plantilla base o esqueleto global del sitio (contiene <html>, <head>, <body>, cabecera, pie de página). Define la estructura común que comparten varias páginas y reserva un espacio donde se inyecta el contenido dinámico de cada vista.

Vista (View): Es la plantilla específica de una página completa (por ejemplo, la página de inicio o el perfil de usuario). Contiene el contenido único de esa ruta y se inserta dentro del Layout.

Parcial (Partial): Es un fragmento de código HTML/plantilla reutilizable dentro de varias vistas o layouts (por ejemplo, una tarjeta de producto, un menú de navegación o un buscador). Evita duplicar código.

## Datos enviados a una vista mediante res.render

El método res.render sirve para renderizar una plantilla HTML en el servidor y enviarla al cliente. 

# express.static: 
es un middleware integrado en Express.js que sirve archivos estáticos (como hojas de estilo CSS, imágenes, archivos JavaScript del cliente o documentos) de forma directa, permitiendo que el navegador acceda a ellos a través de una URL sin necesidad de definir rutas individuales para cada archivo.
¿Cómo funciona? Le indicas a Express qué carpeta de tu proyecto contendrá los recursos públicos (por convención suele llamarse public).
# express.urlencoded: 
es un middleware integrado en Express.js que analiza (parsea) los datos enviados desde un formulario HTML mediante peticiones HTTP (normalmente POST o PUT) y los transforma en un objeto de JavaScript accesible a través de req.body.
# Cómo funciona? 
Captura la información que viaja en el cuerpo (body) de la petición en formato application/x-www-form-urlencoded (el formato estándar de los formularios <form>) y la convierte en un objeto legible.
# El recorrido POST - Redirección - GET (conocido como patrón PRG: Post/Redirect/Get):
 es un patrón de diseño en desarrollo web que separa el procesamiento de un formulario de la visualización de sus resultados. Consiste en recibir los datos mediante POST, procesarlos en el servidor, responder con una redirección HTTP (código 302/303) y solicitar al navegador que cargue una nueva página mediante GET.
 # ¿Por qué se utiliza?
Evita el reenvío accidental de datos cuando un usuario recarga la página (F5), impidiendo que se dupliquen acciones como compras, registros o creaciones de registros en la base de datos.

