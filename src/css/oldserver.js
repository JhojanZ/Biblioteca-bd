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

// Ruta para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    console.log(`Login attempt from IP: ${ipAddress} with username: ${username}`);

    const query = `SELECT * FROM Administradores WHERE id_usuario = ? AND contraseña = ?`;
    db.query(query, [username, password], (err, results) => {
        if (err) {
            const logQuery = `INSERT INTO LoginLogs (id_usuario, ip_address, success, message) VALUES (?, ?, ?, ?)`;
            db.query(logQuery, [username, ipAddress, 0, 'Database query failed'], () => {});
            console.error('Database query failed: ' + err.stack);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            const logQuery = `INSERT INTO LoginLogs (id_usuario, ip_address, success, message) VALUES (?, ?, ?, ?)`;
            db.query(logQuery, [username, ipAddress, 0, 'Invalid credentials'], () => {});
            console.log(`Login failed for username: ${username} from IP: ${ipAddress}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const logQuery = `INSERT INTO LoginLogs (id_usuario, ip_address, success, message) VALUES (?, ?, ?, ?)`;
        db.query(logQuery, [username, ipAddress, 1, 'Login successful'], () => {});

        res.json({ message: 'Login successful' });
    });
});

// Ruta para insertar un nuevo préstamo
app.post('/api/loans', (req, res) => {
    const { bookID, userID } = req.body;


    const query = `INSERT INTO Loans (bookID, userID, loan_date) VALUES (?, ?, NOW())`;
    db.query(query, [bookID, userID], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Loan created successfully' });
    });
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


// Ruta para insertar un nuevo préstamo
app.post('/api/prestamos', (req, res) => {
    const { bookID, userID } = req.body;
    console.log(`Prestamo attempt with bookID: ${bookID} and userID: ${userID}`);

    // Verificar si el usuario existe
    const userQuery = `SELECT * FROM Usuarios WHERE id_usuario = ?`;
    db.query(userQuery, [userID], (err, userResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve all user data
        const userData = {
            id: userResults[0].Id_usuario,
            firstName: userResults[0].Nombre,
            lastName: userResults[0].Apellido,
            phone: userResults[0].Telefono,
            email: userResults[0].Correo
        };

        // Insertar el préstamo
        const loanQuery = `
            INSERT INTO Prestamos (Id_libro, Id_usuario, Fecha_prestamo, Fecha_devolucion, Estado)
            VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 0)
        `;

        db.query(loanQuery, [bookID, userID], (err, loanResults) => {
            if (err) {
            return res.status(500).json({ error: 'Database query failed' });
            }

            // Obtener la fecha del préstamo y el ID único generado
            const loanDateQuery = `SELECT Fecha_prestamo FROM Prestamos WHERE Id_prestamo = ?`;
            db.query(loanDateQuery, [loanResults.insertId], (err, dateResults) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to retrieve loan date' });
            }
            res.json({
                message: 'Loan registered successfully',
                loanID: loanResults.insertId,
                loanDate: dateResults[0].Fecha_prestamo,
                returnDate: loanReturnDate
            });
            });
        });
        db.query(loanQuery, [bookID, userID], (err, loanResults) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }

            // Obtener la fecha del préstamo y el ID único generado
            const loanDateQuery = `SELECT Fecha_prestamo FROM Prestamos WHERE Id_prestamo = ?`;
            db.query(loanDateQuery, [loanResults.insertId], (err, dateResults) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve loan date' });
                }
                res.json({
                    message: 'Loan registered successfully',
                    loanID: loanResults.insertId,
                    loanDate: dateResults[0].Fecha_prestamo
                });
            });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
