import express from 'express';
import {
	sendContact,
	listMails,
	getMailById
} from '../controllers/mailerController.js';

const router = express.Router();

// ➕ Enviar contacto
router.post('/', sendContact);
router.get('/', listMails);
router.get('/:id', getMailById);

export default router;