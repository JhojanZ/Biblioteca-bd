const express = require('express');
const cors = require('cors');
const loginRutas = require('./rutas/loginRutas');
const librosRutas = require('./rutas/librosRutas');
const prestamosRutas = require('./rutas/prestamosRutas');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', loginRutas);
app.use('/api', librosRutas);
app.use('/api', prestamosRutas);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
