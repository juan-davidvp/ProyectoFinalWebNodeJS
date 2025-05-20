const express = require("express"); //con esto Podemos inicializar nuestro server en NODE JS.

const app = express(); //Con esto nos aseguramos de encender el server en nuestra app.
const path = require("path"); //Con esto le decimos a la app que vamos a usar rutas.
const mysql = require("mysql"); //Con esto le decimos a la app que vamos a usar mysql como base de datos.
const dotenv = require("dotenv"); //Con esto le decimos a la app que vamos a usar dotenv para manejar variables de entorno.
const publicPath = path.join(__dirname, "public"); //Con esto le decimos a la app que vamos a usar la carpeta public como carpeta publica.


app.use(express.static(publicPath)); 
app.use(express.urlencoded({extended: false})); 
app.use(express.json()); 

app.use('/auth', require('./routes/auth')); //Con esto le decimos a la app que vamos a usar el router de la carpeta routes.
app.use('/', require('./routes/page')); //Con esto le decimos a la app que vamos a usar el router de la carpeta routes.

dotenv.config({path : "./.env"}); 
app.set("view engine", "hbs"); 

const db = mysql.createConnection({ //Con esto le decimos a la app que vamos a usar mysql como base de datos.
    host: process.env.DATABASE_HOST, //Con esto le decimos a la app que la base de datos esta en localhost.
    user: process.env.DATABASE_USER, //Con esto le decimos a la app que el usuario de la base de datos es root.
    password: process.env.DATABASE_PASSWORD, //Con esto le decimos a la app que la contraseña de la base de datos es vacia.    
    database: process.env.DATABASE //Con esto le decimos a la app que la base de datos que vamos a usar es test.
}); //Con esto le decimos a la app que la base de datos que vamos a usar es test.

db.connect((err) => { //Con esto le decimos a la app que se conecte a la base de datos.
    if (err) { //Con esto le decimos a la app que si hay un error al conectarse a la base de datos, muestre un mensaje en la consola.
        throw err; //Con esto le decimos a la app que si hay un error al conectarse a la base de datos, muestre un mensaje en la consola.
    }
    console.log("Mysql Connected..."); //Con esto le decimos a la app que si se conecta a la base de datos, muestre un mensaje en la consola.
}); //Con esto le decimos a la app que si se conecta a la base de datos, muestre un mensaje en la consola.


app.listen(3000, () => {
    console.log("Server on port 3000"); //Con esto le decimos a la app que escuche en el puerto 3000 y que muestre un mensaje en la consola.
});