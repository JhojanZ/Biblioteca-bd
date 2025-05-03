const db = require('./conexiones');

const crearPrestamo = (bookID, userID, date, endDate, callback) => {
    console.log('Creando préstamo con bookID:', bookID, 'y userID:', userID);
    const query = `INSERT INTO Prestamos (Id_libro, Id_usuario, Fecha_prestamo, Fecha_devolucion) VALUES (?, ?, ?, ?)`;
    console.log(query);
    console.log([bookID, userID, date, endDate]);

    db.query(query, [bookID, userID, date, endDate], (err) => {
        if (err) {
            console.error('Error al crear el préstamo:', err);
        } else {
            console.log('Préstamo creado exitosamente');
        }
        callback(err);
    });
};

const obtenerPrestamosPorUsuario = (userID, callback) => {
    const query = `SELECT l.bookID, l.title, p.Fecha_prestamo, p.Fecha_devolucion 
                   FROM Prestamos p 
                   JOIN Libros l ON p.Id_libro = l.bookID
                   WHERE p.Id_usuario = ? AND p.Estado = 0`;
    
    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error al obtener los préstamos:', err);
        } else {
            console.log('Préstamos obtenidos:', results);
        }
        callback(err, results);
    });
};

const actualizarDevoluciones = (prestamoID, callback) => {
    const query = `UPDATE Prestamos SET Estado = 1, Fecha_devolucion = ? WHERE Id_prestamo IN (?)`;
    console.log('Query para actualizar devoluciones:', query);
    console.log('Parámetro prestamoID:', prestamoID);
    
    db.query(query, [new Date(), prestamoID], (err) => {
        if (err) {
            console.error('Error al actualizar las devoluciones:', err);
        } else {
            console.log('Devoluciones actualizadas exitosamente');
        }
        callback(err);
    });
};

module.exports = { crearPrestamo, obtenerPrestamosPorUsuario, actualizarDevoluciones };

