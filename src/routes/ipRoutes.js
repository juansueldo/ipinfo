import express from 'express';
import {
	getAllIPs,
	createIP,
	getStats,
	getIPById,
	updateIP,
	deleteIP
} from '../controllers/ipController.js';

const router = express.Router();

// Rutas
router.get('/', getAllIPs);
router.post('/', createIP);
router.get('/stats', getStats);
router.get('/:id', getIPById);
router.put('/:id', updateIP);
router.delete('/:id', deleteIP);

export default router;