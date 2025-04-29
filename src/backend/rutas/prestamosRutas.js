const express = require('express');
const router = express.Router();
const { crearPrestamo } = require('../db/prestamosQueries');

router.post('/loans', (req, res) => {
    const { bookID, userID } = req.body;

    crearPrestamo(bookID, userID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Loan created successfully' });
    });
});

module.exports = router;