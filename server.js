
import app from './index.js';
import { syncModels } from './src/models/index.js';


const PORT = process.env.PORT || 3000;

syncModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar modelos:', err);
});