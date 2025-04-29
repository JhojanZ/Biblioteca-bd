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
    const query = `SELECT * FROM Administradores WHERE id_usuario = ? AND contraseña = ?`;
    db.query(query, [id_usuario, contraseña], callback);
};

module.exports = { logLoginIntento, validarUsuario };