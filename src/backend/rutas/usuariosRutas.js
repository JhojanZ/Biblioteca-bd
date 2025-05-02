const express = require('express');
const router = express.Router();
const { nuevoUsuario } = require('../db/usuarioQueries'); // Asegúrate de que la ruta sea correcta

// Ruta para agregar un nuevo usuario
router.post('/nuevoUsuarios', (req, res) => {
    console.log('Received data Usuario:', req.body);

    const { id_usuario, name, lastname, email, gender, age, phone, address, occupation } = req.body;

    if (!id_usuario || !name || !lastname || !email || !age || !phone || !address || !occupation) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!gender){
        gender = null;
    } else {
        gender = gender.toLowerCase();
    }

    const nuevoUsuario = {
        id_usuario,
        name,
        lastname,
        email,
        gender,
        age,
        phone,
        address,
        occupation,
    };

    console.log('Nuevo usuario:', nuevoUsuario);

    nuevoUsuario(nuevoUsuario, (err) => {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return res.status(500).json({ message: 'Error al agregar el usuario' });
        }
        return res.status(201).json({ message: 'Usuario agregado exitosamente', usuario: nuevoUsuario });
    });
});

module.exports = router;