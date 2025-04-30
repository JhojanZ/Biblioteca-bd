

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
