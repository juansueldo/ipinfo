require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 10 requests por IP
  message: 'Demasiadas solicitudes, intentá más tarde'
});


// Rutas
app.use('/api/ips', require('./src/routes/ipRoutes'));
app.use('/api/mailer', limiter, require('./src/routes/mailer'));

// Exportar la aplicación para usarla en server.js
module.exports = app;