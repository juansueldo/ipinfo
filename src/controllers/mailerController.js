
import nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Mailer } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configuración de handlebars para nodemailer
transporter.use('compile', nodemailerExpressHandlebars({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve(__dirname, '../templates'),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, '../templates'),
  extName: '.hbs',
}));


export const sendContact = async (req, res) => {
  try {
    const { name, email, message, lang } = req.body;
    if (req.body.website) {
      return res.status(400).json({ error: 'Spam detectado' });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }


      await Mailer.create({ name, email, message });
      //  Mail para vos (admin)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo contacto de ${name}`,
        template: 'admin_notify',
        context: {
          name,
          email,
          message,
          date: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
        }
      });


    // Mensajes según idioma
    const subjects = {
      es: 'Recibí tu mensaje',
      en: 'Message received'
    };
    const subject = subjects[lang] || subjects['es'];

    // Auto-respuesta HTML
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      template: 'autoresponse',
      context: {
        name,
        message,
        isEn: lang === 'en'
      }
    });

    res.json({ ok: true });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ ok: false, error: 'Error enviando el mensaje' });
  }
};

// Listar todos los correos
export const listMails = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name:  { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Mailer.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'name', 'email', 'createdAt'], // Sin message para aliviar el listado
    });

    res.json({
      ok: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error('Error listando correos:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener los correos' });
  }
};

// Ver detalle por ID
export const getMailById = async (req, res) => {
  try {
    const { id } = req.params;

    const mail = await Mailer.findByPk(id);

    if (!mail) {
      return res.status(404).json({ ok: false, error: 'Correo no encontrado' });
    }

    res.json({ ok: true, data: mail });
  } catch (error) {
    console.error('Error obteniendo correo:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener el correo' });
  }
};