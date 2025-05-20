exports.login = (req, res) => {
    console.log(req.body); //Con esto le decimos a la app que muestre en la consola el body de la peticion. 
    res.send("Form Submited"); //Con esto le decimos a la app que envie una respuesta al cliente.
}
