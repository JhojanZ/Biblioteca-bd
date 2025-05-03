const db = require('./conexiones');

const nuevoUsuario = (param, callback) => {
    const { id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación } = param;

    const query = `INSERT INTO Usuarios (id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log(query);
    console.log([id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación]);
    
    db.query(query, [id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación], (err) => {
        if (err) {
            console.error('Error al registrar el intento de inicio de sesión: ' + err.stack);
        }
        callback(err);
    });
};

const consultas = (param, callback) => {
    console.log('Received query:', param.query);

    // Validar que param.query exista y tenga los campos necesarios
    if (!param.query || !param.query.type || !param.query.limit) {
        return callback({ error: 'Parámetros de consulta inválidos' }, null);
    }

    const { type, limit } = param.query;

    // Validar que limit sea un número
    if (isNaN(limit) || limit <= 0) {
        return callback({ error: 'El parámetro "limit" debe ser un número válido mayor a 0' }, null);
    }

    let query = '';
    switch (type) {
        case 'all-users':
            query = `SELECT * FROM Usuarios LIMIT ?`;
            break;
        case 'active-loans':
            query = `SELECT P.*, U.email, U.Num_telefono, U.Dirección FROM Prestamos P JOIN Usuarios U ON P.Id_usuario = U.id_usuario WHERE estado = 0 LIMIT ?`;
            break;
        case 'overdue-loans':
            query = `SELECT P.*, U.email, U.Num_telefono, U.Dirección FROM Prestamos P JOIN Usuarios U ON P.Id_usuario = U.id_usuario WHERE estado = 0 AND Fecha_devolucion < CURDATE() LIMIT ?`;
            break;
        case 'book-loans':
            query = `SELECT P.*, L.title FROM Prestamos P JOIN Libros L ON P.Id_libro = L.bookID WHERE P.Estado = 0 LIMIT ?`;
            break;
        default:
            return callback({ error: 'Tipo de consulta no válido' }, null);
    }

    console.log('Query:', query);
    console.log('Query Params:', limit);

    // Ejecutar la consulta
    db.query(query, [parseInt(limit)], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return callback({ error: 'Error en la base de datos' }, null);
        }
        callback(null, results);
    });
};

module.exports = { nuevoUsuario, consultas };