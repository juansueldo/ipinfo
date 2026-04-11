const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ips = sequelize.define('IP', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
   ip: DataTypes.STRING,

    isp: DataTypes.JSON,
    location: DataTypes.JSON,
    risk: DataTypes.JSON,

    path: DataTypes.STRING,
    lang: DataTypes.STRING,
    userAgent: DataTypes.TEXT
});

module.exports = ips;