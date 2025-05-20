const dotenv = require("dotenv");
const mysql = require('mysql'); //Con esto le decimos a la app que vamos a usar mysql como base de datos.
dotenv.config({path : "./.env"}); 
const db = mysql.createConnection({ //Con esto le decimos a la app que vamos a usar mysql como base de datos.
    host: process.env.DATABASE_HOST, //Con esto le decimos a la app que la base de datos esta en localhost.
    user: process.env.DATABASE_USER, //Con esto le decimos a la app que el usuario de la base de datos es root.
    password: process.env.DATABASE_PASSWORD, //Con esto le decimos a la app que la contraseña de la base de datos es vacia.    
    database: process.env.DATABASE //Con esto le decimos a la app que la base de datos que vamos a usar es test.
}); //Con esto le decimos a la app que la base de datos que vamos a usar es test.

db.connect((error) => {
    if (error) {
        console.log("Error al conectar con la base de datos:", error);
    } else {
        console.log("MySQL Conectado en auth.js...");
    }
});


exports.login =  (req, res) => { // Convertida a async para usar await con bcrypt.compare
    try {
        const { email, password } = req.body;
        let message = ''; // Variable para mensajes de error o éxito.
        console.log("Email:", email);
        console.log("Password:", password);
        // Comentario: Validar que los campos no estén vacíos (Página 5 del PDF).
        if (!email || !password) {
            message = 'Por favor ingrese su email y contraseña';
            // Comentario: El PDF indica renderizar 'index.hbs' para errores de login.
            // Asegúrate que tu 'index.hbs' puede mostrar la variable 'message'.
            return res.render('login', {
                message: message
            });
        }

        

        // Comentario: Consultar la base de datos para encontrar el usuario por email (Página 6 del PDF).
        db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log("Error en la consulta de login:", error);
                message = 'Error interno del servidor al intentar iniciar sesión.';
                return res.render('login', { message });
            }

            // Comentario: Verificar si el usuario existe y si la contraseña coincide (Página 7 del PDF).
            if (results.length === 0) {
                message = 'Email o Contraseña incorrecta';
                return res.render('login', {
                    message: message
                });
            } else {
                
                const user = results[0]; // Suponiendo que el email es único, tomamos el primer resultado.
                // Comentario: Comparación de contraseña en texto plano.
                // ¡¡¡ADVERTENCIA DE SEGURIDAD: ESTO NO ES RECOMENDADO!!!
                // const passwordMatch = await bcrypt.compare(password, user.password);
                const passwordMatch = (password === user.password);

                if (!passwordMatch) {
                    message = 'Email o Contraseña incorrecta';
                    return res.render('login', {
                        message: message
                    });
                } else {
                    
                    const user_id = user.id;
                    const user_name = user.name;
                    const user_email = user.email;

                    req.session.user = {
                        id: user_id,
                        name: user_name,
                        email: user_email
                    };

                    message = 'Bienvenido: ';
                    console.log(req.session.user);

                    req.session.save(err => {
                        if (err) {
                            console.error("Error saving session:", err);
                            message = 'Error al guardar la sesión.';
                            return res.render('login', { message });
                        } else {
                            console.log("Sesion guardada con exito");
                            return res.render('Sign', {
                                message: message,
                                data_user: req.session.user,
                                accountNumber: '12345', // Ejemplo
                                balance: 5000,         // Ejemplo
                                transactions: [] // Ejemplo
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log("Error en la función de login:", error);
        // Comentario: Manejo de errores inesperados.
        return res.render('index', {
            message: 'Ocurrió un error inesperado.'
        });
    }
};
