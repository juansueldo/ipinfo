const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ips = sequelize.define('IP', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ip: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    isp: DataTypes.STRING,
    path: DataTypes.STRING,
    lang: DataTypes.STRING,
    userAgent: DataTypes.TEXT
});

module.exports = ips;