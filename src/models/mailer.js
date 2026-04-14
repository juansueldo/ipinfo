const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const mailer = sequelize.define('Mailer', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  message: DataTypes.TEXT
});

module.exports = mailer;