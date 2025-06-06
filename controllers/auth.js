const dotenv = require("dotenv");
const mysql = require('mysql'); //Con esto le decimos a la app que vamos a usar mysql como base de datos.
dotenv.config({path : "./.env"}); 
const db = mysql.createConnection({ //Con esto le decimos a la app que vamos a usar mysql como base de datos.
    host: process.env.DATABASE_HOST, //Con esto le decimos a la app que la base de datos esta en localhost.
    user: process.env.DATABASE_USER, //Con esto le decimos a la app que el usuario de la base de datos es root.
    email: process.env.DATABASE_email, //Con esto le decimos a la app que la contraseña de la base de datos es vacia.    
    database: process.env.DATABASE //Con esto le decimos a la app que la base de datos que vamos a usar es test.
}); //Con esto le decimos a la app que la base de datos que vamos a usar es test.

db.connect((error) => {
    if (error) {
        console.log("Error al conectar con la base de datos:", error);
    } else {
        console.log("MySQL Conectado en auth.js...");
    }
});


exports.register = (req, res) => {
    try {
        console.log("Registro de usuario iniciado...");
    const { name, email, password, passwordResend } = req.body;
    let message = '';

    console.log(name, email, password, passwordResend);

    if (!name || !email || !password || !passwordResend) {
        message = 'Por favor, complete todos los campos.';
        console.log("Campos incompletos:", message);
        return res.render('login', {
                error_login: message,
                activeTab: 'register' // Para mantener la pestaña de registro activa
            });
        
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => { 
        
        if (error) {
            console.log("Error en la consulta de email existente:", error);
            message = 'Error al verificar el correo electrónico.';
            return res.render('login', {
                error_login: message,
                activeTab: 'register' // Para mantener la pestaña de registro activa
            });
        }

        if (results.length > 0) {
            message = 'El email ya se encuentra registrado';
            return res.render('login', {
                error_login: message,
                activeTab: 'register' // Para mantener la pestaña de registro activa
            });
        } else if (password !== passwordResend) {
            message = 'Las contraseñas no coinciden';
            return res.render('login', {
                error_login: message,
                activeTab: 'register' // Para mantener la pestaña de registro activa
            });
        }
        console.log("Email no registrado, procediendo a insertar usuario...");
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: password }, (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.log("Error al insertar usuario:", errorInsert);
                message = 'Error al registrar el usuario.' + req.session.user;
                return res.render('login', {
                error_login: message,
                activeTab: 'register' // Para mantener la pestaña de registro activa
            });
            } else {
                console.log("Usuario registrado correctamente:", resultsInsert);
                message = 'Usuario Registrado Correctamente';
                const registeredUserName = req.body.name; // O como obtengas el nombre de usuario
                const registeredUserMail = req.body.email; // O como obtengas el email
            

            // RENDER DEL REGISTER EXITOSO
                return res.render('login', {
                    registrationSuccessMessage: `El usuario: ${registeredUserName}, con correo: ${registeredUserMail} se ha registrado exitosamente!`,
                    registeredUser: registeredUserName,
                    registeredMail: registeredUserMail,
                    showToast: true, // Un indicador para el script
                    activeTab: 'register' // Para mantener la pestaña de registro activa
                });
                // NOTA: Para usar esta opción, el script en login.hbs debería leer estas variables de Handlebars en lugar de parámetros URL.
                

            }
        });



    });
    } catch (error) {
        console.log("Error en la función de registro:", error);
        return res.render('login', {
            message: 'Ocurrió un error inesperado al registrar el usuario.'
        });
    };
    
};



exports.logout = (req, res) => {
  console.log("sesion a borrar: ", req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session: ", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
    console.error("hola funciono perra");
  });
}


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
                error_login: message
            });
        }

        

        // Comentario: Consultar la base de datos para encontrar el usuario por email (Página 6 del PDF).
        db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log("Error en la consulta de login:", error);
                message = 'Error interno del servidor al intentar iniciar sesión.';
                return res.render('login', { error_login: message });
            }

            // Comentario: Verificar si el usuario existe y si la contraseña coincide (Página 7 del PDF).
            if (results.length === 0) {
                message = 'Email o Contraseña incorrecta';
                return res.render('login', {
                    error_login: message
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
                        error_login: message
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
                            return res.render('login', { error_login: message });
                        } else {
                            console.log("Sesion guardada con exito");
                            return res.render('sign2', {
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
