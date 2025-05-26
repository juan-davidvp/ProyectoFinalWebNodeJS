const express = require('express');
const router = express.Router();

// Ruta para renderizar index.hbs
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta para renderizar login.hbs
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para renderizar login.hbs
router.get('/sign', (req, res) => {
    res.render('Sign');
});

module.exports = router;