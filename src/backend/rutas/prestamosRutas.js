const express = require('express');
const router = express.Router();
const { crearPrestamo, obtenerPrestamosPorUsuario, actualizarDevoluciones } = require('../db/prestamosQueries');
//const { obtenerLibrosPrestados } = require('../db/librosQueries');
//const { obtenerUsuarios } = require('../db/usuariosQueries');

router.post('/prestamos', (req, res) => {
    const { bookID, userID } = req.body;
    const date = new Date();
    console.log('Received data:', req.body);
    
    if (!bookID || !userID) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    

    crearPrestamo(bookID, userID, date, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.json({ message: 'Préstamo creado exitosamente' });
    });
});


router.get('/prestamos/:userID', (req, res) => {
    const { userID } = req.params;
    obtenerPrestamosPorUsuario(userID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los préstamos' });
        }
        res.json(results);
    });
});

router.post('/prestamos/devoluciones', (req, res) => {
    const { prestamosID } = req.body;
    if (!prestamosID || prestamosID.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron préstamos para actualizar' });
    }
    console.log('Received prestamosID:', prestamosID);
    console.log('Received request body:', req.body);
    actualizarDevoluciones(prestamosID, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar las devoluciones' });
        }
        res.json({ message: 'Devoluciones registradas exitosamente' });
    });
});

module.exports = router;