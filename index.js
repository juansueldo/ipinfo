require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Rutas
app.use('/api/ips', require('./src/routes/ipRoutes'));

// Exportar la aplicación para usarla en server.js
module.exports = app;