## Trabajo práctico 05 - Pipeline de middleware en Express
# Diferencia entre middleware incorporado, de terceros y personalizado
Incorporado (Built-in): Viene incluido con Express (ej. express.urlencoded, express.json, express.static).

De terceros (Third-party): Paquetes instalados mediante npm (ej. morgan, express-ejs-layouts).

Personalizado (Custom): Funciones creadas a medida por el desarrollador para lógica específica (identificarSolicitud, medirDuracion, validarReserva).

# ¿Cuándo se utiliza next()?
next() se invoca cuando el middleware ha terminado exitosamente su procesamiento y desea ceder el control al siguiente middleware o handler en el pipeline. Si no se llama a next() ni se finaliza la respuesta (con res.render, res.send o res.redirect), la solicitud queda colgada.
# ¿Por qué los parsers aparecen antes de la validación?
express.urlencoded y express.json transforman el cuerpo de la petición HTTP recibida en texto plano en un objeto JavaScript accesible mediante req.body. La validación necesita leer estos datos ya estructurados para operar.

# Diferencia entre alcance global, de router y de ruta
Global: Se ejecuta para todas las peticiones que entran al servidor (registrados con app.use(...)).

De Router: Solo se aplica a las solicitudes que coincidan con el prefijo montado (ej. reservasRouter.use(...) afecta únicamente a rutas que inicien con /reservas).

De Ruta: Se aplica única y exclusivamente a un endpoint específico (ej. validarReserva pasado como argumento dentro de reservasRouter.post('/', validarReserva, crearReserva)).
# Motivo del evento finish
El evento finish de res permite calcular con precisión el tiempo real que tardó el servidor en procesar la solicitud completa y enviar la respuesta al cliente. Calcularlo antes de renderizar o redirigir daría una medición incompleta.
# Resultado del montaje del router
Al ejecutar app.use("/reservas", reservasRouter), todas las rutas dentro del router son relativas a /reservas. Por ende, la ruta definida como /nueva dentro del router responde a /reservas/nueva.
# Diferencia entre el POST 302 y el GET posterior
El POST recibe y procesa el formulario. Al completarse con éxito, responde un estado HTTP 302 Found (Redirección) con la cabecera Location: /reservas. El navegador del usuario realiza automáticamente una segunda petición GET /reservas, previniendo que al recargar la página se reenvíe el formulario accidentalmente (patrón Post/Redirect/Get).
# Motivo por el cual las altas desaparecen al reiniciar
Debido a que la lista de reservas está almacenada en una variable dentro de la memoria RAM de Node.js. Al reiniciar el proceso de la aplicación, el estado de la memoria se destruye y vuelve a inicializarse con los datos definidos por defecto
