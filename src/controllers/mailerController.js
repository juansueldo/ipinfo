const nodemailer = require('nodemailer');

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