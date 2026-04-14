const express = require('express');
const router = express.Router();

// Controladores
const mailerController = require('../controllers/mailerController');

// ➕ Enviar contacto
router.post('/', mailerController.sendContact);
router.get('/', mailerController.listMails);
router.get('/:id', mailerController.getMailById);
module.exports = router;