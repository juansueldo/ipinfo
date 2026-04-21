
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import ipRoutes from './src/routes/ipRoutes.js';
import mailerRoutes from './src/routes/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
  origin: [
    'http://localhost:4321', // Astro en desarrollo
    'http://localhost:3000', // React en desarrollo
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
  max: 2, // max 2 requests por IP
  message: 'Demasiadas solicitudes, intentá más tarde'
});


// Rutas
app.use('/api/ips', ipRoutes);
app.use('/api/mailer', limiter, mailerRoutes);

// Exportar la aplicación para usarla en server.js
export default app;