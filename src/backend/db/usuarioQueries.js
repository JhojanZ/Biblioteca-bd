const db = require('./conexiones');

const nuevoUsuario = (param, callback) => {
    const { id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación } = param;

    const query = `INSERT INTO LoginLogs (id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log(query);
    console.log([id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación]);

    /*
    db.query(query, [id_usuario, Nombre, Apellido, email, gender, Edad, Num_telefono, Dirección, Ocupación], (err) => {
        if (err) {
            console.error('Error al registrar el intento de inicio de sesión: ' + err.stack);
        }
    });
    */
};

module.exports = { nuevoUsuario };