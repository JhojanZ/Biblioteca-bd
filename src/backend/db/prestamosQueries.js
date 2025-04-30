const db = require('./conexiones');

const crearPrestamo = (bookID, userID, date, callback) => {
    console.log('Creando préstamo con bookID:', bookID, 'y userID:', userID);
    const query = `INSERT INTO Prestamos (Id_libro, Id_usuario, Fecha_prestamo) VALUES (?, ?, ?)`;
    console.log(query);
    console.log([bookID, userID, date]);
    db.query(query, [bookID, userID, date], callback);
};

const obtenerPrestamosPorUsuario = (userID, callback) => {
    const query = `SELECT p.Id_prestamo, l.title, p.Fecha_prestamo 
                   FROM Prestamos p 
                   JOIN Libros l ON p.Id_libro = l.bookID
                   WHERE p.Id_usuario = ? AND p.Estado = 0`;
    db.query(query, [userID], callback);
};

const actualizarDevoluciones = (prestamoID, callback) => {
    const query = `UPDATE Prestamos SET Estado = 1, Fecha_devolucion = ? WHERE Id_prestamo IN (?)`;
    console.log('Query para actualizar devoluciones:', query);
    console.log('Parámetro prestamoID:', prestamoID);
    db.query(query, [new Date(), prestamoID], callback);
};

module.exports = { crearPrestamo, obtenerPrestamosPorUsuario, actualizarDevoluciones };

