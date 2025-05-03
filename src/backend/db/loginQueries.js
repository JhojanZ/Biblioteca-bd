const db = require('./conexiones');

const logLoginIntento = (id_usuario, ip, exito, mensaje) => {
    const query = `INSERT INTO LoginLogs (id_usuario, ip_address, exito, mensaje) VALUES (?, ?, ?, ?)`;
    console.log(query);
    console.log([id_usuario, ip, exito, mensaje]);
    db.query(query, [id_usuario, ip, exito, mensaje], (err) => {
        if (err) {
            console.error('Error al registrar el intento de inicio de sesión: ' + err.stack);
        }
        
    });
};

const validarUsuario = (id_usuario, contraseña, callback) => {
    const query = `SELECT * FROM Administradores WHERE id_usuario = ? AND encript_contra = ?`;
    console.log(query);
    console.log([id_usuario, contraseña]);
    db.query(query, [id_usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error al validar el usuario: ' + err.stack);
            return callback(err);
        }
        console.log('Resultados de la validación:', results);
        callback(null, results);
    });
};

module.exports = { logLoginIntento, validarUsuario };