const express = require('express');
const router = express.Router();
const { getLibros, insertarLibro } = require('../db/librosQueries');

router.get('/books', (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const offset = (page - 1) * limit;
    
    getLibros({ ...filters, limit, offset }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ libros: results });
    });
});

router.get('/books/:id', (req, res) => {
    const bookID = req.params.id;

    getLibros({ bookID }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ libro: results[0] });
    });
});

// Ruta para agregar un nuevo libro
router.post('/books/nuevo_libro', (req, res) => {
    let { title, author, publisher, pages, publicationDate, isbn, isbn13, language, cant } = req.body;
    console.log(`Agregando libro: ${JSON.stringify(req.body)}`);

    if (!title || !author || !publisher || !pages || !publicationDate || !language || !cant) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if(!(isbn || isbn13)) {
        return res.status(400).json({ error: 'ISBN y ISBN13 son obligatorios' });
    }
    if(!isbn) { 
        isbn = 0;
    }
    if(!isbn13) { 
        isbn13 = 0;
    }

    insertarLibro({ title, author, publisher, pages, publicationDate, isbn, isbn13, language, cant }, (err, results) => {
        console.log("Resultados de la inserción:", results);
        if (err) {
            console.error('Error al insertar el libro:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.json({ message: 'Libro agregado exitosamente' });
    });
});

module.exports = router;