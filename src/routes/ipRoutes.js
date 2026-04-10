const express = require('express');
const router = express.Router();

// Controladores
const ipController = require('../controllers/ipController');

// Rutas
router.get('/', ipController.getAllIPs);
router.post('/', ipController.createIP);
router.get('/:id', ipController.getIPById);
router.put('/:id', ipController.updateIP);
router.delete('/:id', ipController.deleteIP);

module.exports = router;