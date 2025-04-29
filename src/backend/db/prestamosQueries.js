const db = require('./conexiones');

const crearPrestamo = (bookID, userID, callback) => {
    const query = `INSERT INTO Loans (bookID, userID, loan_date) VALUES (?, ?, NOW())`;
    db.query(query, [bookID, userID], callback);
};

module.exports = { crearPrestamo };