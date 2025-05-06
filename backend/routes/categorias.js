const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriasController');

// Rutas correctamente definidas
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoria);
router.post('/', categoriaController.createCategoria);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;