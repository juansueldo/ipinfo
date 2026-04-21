import sequelize from './db.js';
import IP from './ipmodel.js';
import Mailer from './mailer.js';

// Sincroniza todos los modelos
export async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log('Modelos sincronizados');
}

export { IP, Mailer };