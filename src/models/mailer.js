import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const mailer = sequelize.define('Mailer', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  message: DataTypes.TEXT
});

export default mailer;