const sequelize = require('./db');
const IP = require('./ipmodel');
const Mailer = require('./mailer');

// Sincroniza todos los modelos
async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log('Modelos sincronizados');
}

module.exports = {
  IP,
  Mailer,
  syncModels
};