
// Ajustá esto según tu ORM (Sequelize, Prisma, etc.)
const { IP } = require('../models'); 

// 🔍 Obtener todas las IPs
exports.getAllIPs = async (req, res) => {
  try {
    const ips = await IP.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(ips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las IPs' });
  }
};

// 🔍 Obtener una IP por ID
exports.getIPById = async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);

    if (!ip) {
      return res.status(404).json({ error: 'IP no encontrada' });
    }

    res.json(ip);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la IP' });
  }
};

// ➕ Crear IP (TRACK VISIT)
exports.createIP = async (req, res) => {
  try {
    let ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      '';

    ip = ip.split(',')[0].trim();

    if (ip === '::1') ip = '127.0.0.1';

    let geoData = null;

    try {
      const geoRes = await fetch(`https://api.ipquery.io/${ip}`);
      geoData = await geoRes.json();
    } catch (err) {
      console.warn('Error obteniendo geo data:', err.message);
    }

    const { path, lang, userAgent } = req.body;

    const newIP = await IP.create({
      ip,

      isp: geoData?.isp || null,
      location: geoData?.location || null,
      risk: geoData?.risk || null,

      path: path || null,
      lang: lang || null,
      userAgent: userAgent || null
    });

    res.status(201).json(newIP);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la IP' });
  }
};

// ✏️ Actualizar
exports.updateIP = async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);

    if (!ip) {
      return res.status(404).json({ error: 'IP no encontrada' });
    }

    await ip.update(req.body);

    res.json(ip);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la IP' });
  }
};

// ❌ Eliminar
exports.deleteIP = async (req, res) => {
  try {
    const ip = await IP.findByPk(req.params.id);

    if (!ip) {
      return res.status(404).json({ error: 'IP no encontrada' });
    }

    await ip.destroy();

    res.json({ message: 'IP eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la IP' });
  }
};
