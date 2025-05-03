const express = require('express');
const router = express.Router();
const { crearPrestamo, obtenerPrestamosPorUsuario, actualizarDevoluciones } = require('../db/prestamosQueries');
//const { obtenerLibrosPrestados } = require('../db/librosQueries');
//const { obtenerUsuarios } = require('../db/usuariosQueries');

const formatDateForMySQL = (dateObject) => {
    const isoString = dateObject.toISOString();
    // Cortamos la 'T' y la 'Z', y tomamos solo la parte de segundos
    return isoString.slice(0, 19).replace('T', ' ');
  };
  

router.post('/prestamos', (req, res) => {
    const { bookId, userId } = req.body;
    const dat = new Date();
    const endDat = new Date(dat);
    endDat.setDate(endDat.getDate() + 7); // Sumar 7 días a la fecha actual
    const date = formatDateForMySQL(dat);
    const endDate = formatDateForMySQL(endDat);
    console.log('Received data:', req.body);
    console.log('Received bookId:', bookId);
    console.log('Received userId:', userId);
    
    if (!bookId || !userId) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    console.log("go to the load :D");

    crearPrestamo(bookId, userId, date, endDate, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.json({  endDate : endDate,
                    message: 'Préstamo creado exitosamente' });
    });
});


router.get('/prestamos/:userId', (req, res) => {
    const { userId } = req.params;
    obtenerPrestamosPorUsuario(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los préstamos' });
        }
        res.json(results);
    });
});

router.post('/prestamos/devoluciones', (req, res) => {
    const { bookIds } = req.body;
    console.log('Received data for devoluciones:', req.body);
    console.log('Received bookIds:', bookIds);
    if (!bookIds || bookIds.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron préstamos para actualizar' });
    }
    console.log('Received request body:', req.body);
    actualizarDevoluciones(bookIds, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar las devoluciones' });
        }
        res.json({ message: 'Devoluciones registradas exitosamente' });
    });
});

module.exports = router;