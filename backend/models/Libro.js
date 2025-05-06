const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Libro = sequelize.define('Libro', {
  id_libro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_autor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  anio_publicacion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  portada_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'libros',
  timestamps: false
});

module.exports = Libro;