// server.js
const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const librosRoutes = require('./routes/libros');
const usuarioRoutes = require('./routes/usuarios');
const autorRoutes = require('./routes/autores');
const categoriaRoutes = require('./routes/categorias');
const prestamoRoutes = require('./routes/prestamos');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ruta de prueba para verificar que la API está funcionando
app.get('/api', (req, res) => {
  res.json({ status: 'API funcionando', timestamp: new Date() });
});

// Rutas API
app.use('/api/login', require('./routes/auth'));
app.use('/api/libros', librosRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/prestamos', prestamoRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Iniciar servidor sin sincronizar la base de datos
// Nota: Usamos { force: false } para asegurarnos de no sobrescribir la base de datos existente
db.sequelize.sync({ force: false, alter: false }).then(() => {
  app.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});