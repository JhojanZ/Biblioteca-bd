require('dotenv').config(); // Cargar las variables del archivo .env
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});



app.get('/api/books', (req, res) => {
    const { page = 1, limit = 10, title, author, publisher, pages, publicationDate, rating } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM Libros WHERE 1=1`;
    const params = [];

    if (title) {
        query += ` AND title LIKE ?`;
        params.push(`%${title}%`);
    }
    if (author) {
        query += ` AND authors LIKE ?`;
        params.push(`%${author}%`);
    }
    if (publisher) {
        query += ` AND publisher LIKE ?`;
        params.push(`%${publisher}%`);
    }
    if (pages) {
        query += ` AND num_pages = ?`;
        params.push(pages);
    }
    if (publicationDate) {
        query += ` AND publication_date < ?`;
        params.push(publicationDate);
    }
    if (rating) {
        query += ` AND average_rating >= ?`;
        params.push(rating);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    console.log(`Executing query: ${query} |with params: ${params}`);
    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ books: results });
    });
});


app.get('/api/books/:id', (req, res) => {
    const bookID = req.params.id;

    const query = `SELECT * FROM Libros WHERE bookID = ?`;
    db.query(query, [bookID], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});