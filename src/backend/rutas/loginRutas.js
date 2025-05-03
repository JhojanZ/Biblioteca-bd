const express = require('express');
const router = express.Router();
const { logLoginIntento, validarUsuario } = require('../db/loginQueries');

router.post('/login', (req, res) => {
    const { username: id_usuario, encryptedPassword } = req.body;
    const ip = req.ip;
    console.log(`Intento de inicio de sesión desde IP: ${ip} con nombre de usuario: ${id_usuario}`);

    validarUsuario(id_usuario, encryptedPassword, (err, results) => {
        if (err) {
            logLoginIntento(id_usuario, ip, 0, 'Error en la consulta a la base de datos');
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length === 0) {
            logLoginIntento(id_usuario, ip, 0, 'Credenciales inválidas');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        logLoginIntento(id_usuario, ip, 1, 'Inicio de sesión exitoso');
        res.json({ message: 'Inicio de sesión exitoso' });
    });
});

module.exports = router;