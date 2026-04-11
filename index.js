require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:4321', // Astro en desarrollo
    'https://juansueldo.dev' // tu web en producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/ips', require('./src/routes/ipRoutes'));

// Exportar la aplicación para usarla en server.js
module.exports = app;