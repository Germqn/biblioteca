const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prestamo = sequelize.define('Prestamo', {
  id_prestamo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser NULL según el SQL
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  id_libro: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser NULL según el SQL
    references: {
      model: 'libros',
      key: 'id_libro'
    }
  },
  fecha_prestamo: {
    type: DataTypes.DATEONLY, // Corresponde a DATE en MySQL
    allowNull: false
  },
  fecha_devolucion: {
    type: DataTypes.DATEONLY, // Corresponde a DATE en MySQL
    allowNull: true // Puede ser NULL según el SQL
  }
}, {
  tableName: 'prestamos',
  timestamps: false // No hay campos created_at, updated_at en la definición SQL
});

module.exports = Prestamo;