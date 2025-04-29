const express = require('express');
const router = express.Router();
const { getLibros } = require('../db/librosQueries');

router.get('/books', (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const offset = (page - 1) * limit;

    getLibros({ ...filters, limit, offset }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        console.log('Resultados obtenidos:', results);
        res.json({ libros: results });
    });
});

module.exports = router;