const express = require('express');
const router = express.Router();
const { getLibros } = require('../db/librosQueries');

router.get('/books', (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const offset = (page - 1) * limit;

    console.log(`Parámetros de consulta: ${JSON.stringify(filters)}`);

    getLibros({ ...filters, limit, offset }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        console.log('Resultados obtenidos:', results);
        res.json({ libros: results });
    });
});

router.get('/books/:id', (req, res) => {
    const bookID = req.params.id;
    console.log(`Buscando libro con ID: ${bookID}`);

    getLibros({ bookID }, (err, results) => {
        console.log(`Resultados de la búsqueda: ${JSON.stringify(results)}`);
        console.log(`Resultados de la búsqueda: ${JSON.stringify(results[0])}`);
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ libro: results[0] });
    });
}
);

module.exports = router;
// router.get('/books/:id', (req, res) => {