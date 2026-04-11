const sequelize = require('./db');
const IP = require('./ipmodel');

// Sincroniza todos los modelos
async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log('Modelos sincronizados');
}

module.exports = {
  IP,
  syncModels
};