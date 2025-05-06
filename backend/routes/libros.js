const express = require('express');
const router = express.Router();  // Usa express.Router() en lugar de require('router')
const librosController = require('../controllers/librosController');

// Asegúrate de que los métodos del controlador existen y son funciones
router.get('/', librosController.getLibros);
router.get('/:id', librosController.getLibro);
router.post('/', librosController.createLibro);
router.put('/:id', librosController.updateLibro);
router.delete('/:id', librosController.deleteLibro);

module.exports = router;