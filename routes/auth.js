const express = require('express');
const router = express.Router();

//Con esto le decimos a la app que vamos a usar el controlador de autenticacion.
const AuthController = require('../controllers/auth'); 

//Solo podemos acceder a este router si estamos logueados
router.post('/login', AuthController.login); //Con esto le decimos a la app que si el usuario hace un post a la ruta /login, ejecute la funcion login del controlador AuthController.
router.post('/register', AuthController.register); //Con esto le decimos a la app que si el usuario hace un post a la ruta /login, ejecute la funcion login del controlador AuthController.
module.exports = router; //Con esto le decimos a la app que exporte el router para poder usarlo en otras partes de la app.