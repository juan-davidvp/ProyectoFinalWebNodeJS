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


router.get("/auth/login", (req, res) => {
    if(!req.session.login || !req.session.user){
        res.redirect('/');
    }else{
        res.render('/auth/login');
        console.log('Session user:', req.session.login);
    }

});

module.exports = router;


