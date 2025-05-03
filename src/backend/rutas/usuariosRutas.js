const express = require('express');
const router = express.Router();
const { nuevoUsuario, consultas } = require('../db/usuarioQueries'); // Asegúrate de que la ruta sea correcta

// Ruta para agregar un nuevo usuario
router.post('/nuevoUsuarios', (req, res) => {
    console.log('Received data Usuario:', req.body);

    let { id_usuario, name, lastname, email, gender, age, phone, address, occupation } = req.body;

    if (!id_usuario || !name || !lastname || !email || !age || !phone || !address || !occupation) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!gender){
        gender = null;
    } else {
        gender = gender.toLowerCase();
    }
    console.log("pass, going to db :D");

    const usuarioData = {
        id_usuario,
        Nombre: name,
        Apellido: lastname,
        email,
        gender,
        Edad: age,
        Num_telefono: phone,
        Dirección: address,
        Ocupación: occupation,
    };

    console.log('Nuevo usuario:', usuarioData);

    nuevoUsuario(usuarioData, (err) => {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return res.status(500).json({ message: 'Error al agregar el usuario' });
        }
        return res.status(201).json({ message: 'Usuario agregado exitosamente', usuario: nuevoUsuario });
    });
});

router.get('/consultas', (req, res) => {
    consultas(req, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json(results);
    });
});

module.exports = router;