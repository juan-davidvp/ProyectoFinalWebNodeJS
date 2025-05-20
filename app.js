// 1. Imports de módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
//const cookieParser = require('cookie-parser'); // Si lo usas para otras cosas, si no, no es estrictamente necesario para express-session.
const session = require('express-session'); // Importar express-session

// 2. Configuración de dotenv (cargar variables de entorno)
dotenv.config({
    path: './.env'
});

// 3. Inicialización de la aplicación Express
const app = express();

// 4. Configuración de directorio de archivos públicos
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// 5. Middlewares para parsear el cuerpo de las solicitudes (antes de las rutas y de la sesión si es posible, aunque la sesión no depende directamente de estos)
// Parsear URLs codificadas (como las de formularios HTML)
app.use(express.urlencoded({ extended: false }));
// Parsear payloads JSON
app.use(express.json());
// Parsear cookies (si lo necesitas para algo más que la sesión, si no, express-session lo maneja internamente)
//app.use(cookieParser()); // Asegúrate de que SESSION_SECRET se cargue antes si cookie-parser usa un secreto.

// 6. Configuración del middleware de express-session (¡IMPORTANTE: ANTES de las rutas y del middleware que accede a req.session!)
app.use(session({
    secret: process.env.SESSION_SECRET, // Asegúrate que SESSION_SECRET esté en tu .env
    resave: false,
    saveUninitialized: false, // Cambiado a false según buenas prácticas
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hora de duración para la cookie de sesión
        // secure: true // Descomenta esto si estás en producción y usando HTTPS
    }
}));

// 7. Middleware para hacer disponible 'user' de la sesión en todas las vistas (DESPUÉS de app.use(session(...)))
// Esta es la línea 14 que te da error, ahora debería funcionar porque req.session estará definido.
app.use((req, res, next) => {
    res.locals.user = req.session.user; // req.session debería estar definido por el middleware de sesión anterior
    next();
});

// 8. Configuración del motor de plantillas (Handlebars)
app.set('view engine', 'hbs');

// 9. Definición de Rutas (DESPUÉS de todos los middlewares de configuración general)
app.use('/', require('./routes/page'));
app.use('/auth', require('./routes/auth'));

// 10. Inicio del servidor
const PORT = process.env.PORT || 3000; // Usar variable de entorno para el puerto o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});