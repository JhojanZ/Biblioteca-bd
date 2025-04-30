const express = require('express');
const router = express.Router();
const { crearPrestamo, obtenerPrestamosPorUsuario, actualizarDevoluciones } = require('../db/prestamosQueries');

router.post('/prestamos', (req, res) => {
    const { bookID, userID } = req.body;
    const date = new Date();
    console.log('Received data:', req.body);

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
    const { loanIDs } = req.body;
    if (!loanIDs || loanIDs.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron préstamos para actualizar' });
    }
    console.log('Received loanIDs:', loanIDs);
    console.log('Received request body:', req.body);
    actualizarDevoluciones(loanIDs, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar las devoluciones' });
        }
        res.json({ message: 'Devoluciones registradas exitosamente' });
    });
});

module.exports = router;

module.exports = router;