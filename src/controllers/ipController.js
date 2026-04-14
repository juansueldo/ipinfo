
// Ajustá esto según tu ORM (Sequelize, Prisma, etc.)
const { IP } = require('../models'); 

// 🔍 Obtener todas las IPs
exports.getAllIPs = async (req, res) => {
  try {
    const ips = await IP.findAll({
      order: [['createdAt', 'DESC']],
      limit: 1000 // opcional (evita matar la DB)
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
    let ip = req.ip;

    if (ip === '::1') ip = '127.0.0.1';

    let geoData = null;

    try {
      const geoRes = await fetch(`https://ipinfo-js.vercel.app/${ip}`);
      geoData = await geoRes.json();
    } catch (err) {
      console.warn('Error obteniendo geo data:', err.message);
    }

    const {
      path,
      lang,
      userAgent,

      // 🎯 UTM
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    } = req.body;

    const newIP = await IP.create({
      ip,

      // 🌍 GEO
      continent: geoData?.continent,
      country: geoData?.country,
      country_iso: geoData?.country_iso,
      region: geoData?.region,
      region_iso: geoData?.region_iso,
      city: geoData?.city,
      latitude: geoData?.latitude,
      longitude: geoData?.longitude,
      timezone: geoData?.timezone,
      postal: geoData?.postal,
      accuracy_radius: geoData?.accuracy_radius,

      // 🛰️ RED
      asn: geoData?.asn,
      isp: geoData?.isp,

      // 🌐
      languages: geoData?.languages,

      // 📱 DEVICE
      device_type: geoData?.device?.type,
      device_vendor: geoData?.device?.vendor,
      device_model: geoData?.device?.model,
      os: geoData?.device?.os,
      browser: geoData?.device?.browser,

      // 📊 TRACK
      path,
      lang,
      userAgent,

      // 🎯 CAMPAÑAS
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
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

exports.getStats = async (req, res) => {
  try {
    const visits = await IP.findAll();

    const visitsByDay = {};
    const countries = {};
    const pages = {};
    const devices = {};
    const campaigns = {};
    const browsers = {};

    visits.forEach(v => {
      const date = new Date(v.createdAt).toISOString().split('T')[0];

      // 📈 visitas por día
      visitsByDay[date] = (visitsByDay[date] || 0) + 1;

      // 🌍 países
      const country = v.country || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;

      // 📄 páginas
      const page = v.path || '/';
      pages[page] = (pages[page] || 0) + 1;

      // 📱 dispositivos
      const device = v.device_type || 'unknown';
      devices[device] = (devices[device] || 0) + 1;

      // 🌐 browser
      const browser = v.browser || 'unknown';
      browsers[browser] = (browsers[browser] || 0) + 1;

      // 🎯 campañas
      const campaign = v.utm_campaign || 'direct';
      campaigns[campaign] = (campaigns[campaign] || 0) + 1;
    });

    res.json({
      visitsByDay,
      countries,
      pages,
      devices,
      browsers,
      campaigns
    });

  } catch (error) {
    res.status(500).json({ error: 'Error generando estadísticas' });
  }
};