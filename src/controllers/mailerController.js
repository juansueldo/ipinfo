const nodemailer = require('nodemailer');
const { Mailer } = require('../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


exports.sendContact = async (req, res) => {
  try {
    const { name, email, message, lang } = req.body;
    if (req.body.website) {
      return res.status(400).json({ error: 'Spam detectado' });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

      await Mailer.create({ name, email, message });
    // 📩 Mail para vos
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nuevo contacto de ${name}`,
      text: `
Nuevo contacto:

Nombre: ${name}
Email: ${email}

Mensaje:
${message}
      `
    });

    // 🌍 Mensajes según idioma
    const messages = {
      es: {
        subject: 'Recibí tu mensaje',
        text: `Hola ${name},

¡Gracias por contactarte! He recibido tu mensaje correctamente.

En breve estaré revisándolo y te responderé lo antes posible.

Saludos,
Juan Sueldo`
      },
      en: {
        subject: 'Message received',
        text: `Hi ${name},

Thank you for reaching out! I have received your message successfully.

I will review it shortly and get back to you as soon as possible.

Best regards,
Juan Sueldo`
      }
    };

    const selected = messages[lang] || messages.es;

    // 📬 Auto-respuesta
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: selected.subject,
      text: selected.text
    });

    res.json({ ok: true });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ ok: false, error: 'Error enviando el mensaje' });
  }
};

// Listar todos los correos
exports.listMails = async (req, res) => {
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
exports.getMailById = async (req, res) => {
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