const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const IP = sequelize.define('IP', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  // 🌐 IP
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // 🌍 GEO
  continent: DataTypes.STRING,
  country: DataTypes.STRING,
  country_iso: DataTypes.STRING(5),
  region: DataTypes.STRING,
  region_iso: DataTypes.STRING(10),
  city: DataTypes.STRING,

  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  timezone: DataTypes.STRING,
  postal: DataTypes.STRING,
  accuracy_radius: DataTypes.INTEGER,

  // 🛰️ RED
  asn: DataTypes.INTEGER,
  isp: DataTypes.STRING,

  // 🌐 IDIOMAS
  languages: DataTypes.JSON,

  // 📱 DEVICE
  device_type: DataTypes.STRING,
  device_vendor: DataTypes.STRING,
  device_model: DataTypes.STRING,
  os: DataTypes.STRING,
  browser: DataTypes.STRING,

  // 📊 TRACKING
  path: DataTypes.STRING,
  lang: DataTypes.STRING,
  userAgent: DataTypes.TEXT,

  // 🎯 CAMPAÑAS (UTM)
  utm_source: DataTypes.STRING,
  utm_medium: DataTypes.STRING,
  utm_campaign: DataTypes.STRING,
  utm_term: DataTypes.STRING,
  utm_content: DataTypes.STRING

}, {
  tableName: 'ips',
  timestamps: true
});

module.exports = IP;