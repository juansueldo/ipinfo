require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors({
  origin: [
    'http://localhost:4321', // Astro en desarrollo
    'https://juansueldo.dev', // tu web en producción
    'https://ipinfo-tawny-psi.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rutas
app.use('/api/ips', require('./src/routes/ipRoutes'));

// Exportar la aplicación para usarla en server.js
module.exports = app;