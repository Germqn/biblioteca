const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 10000
    },
    define: {
      timestamps: true
    },
    logging: false // Desactiva los logs para mayor claridad
  }
);

// Función de prueba de conexión mejorada
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MySQL');
    
    // Sincroniza los modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.original || error);
    return false;
  }
}

// Ejecuta la prueba de conexión al iniciar
testConnection();

module.exports = sequelize;