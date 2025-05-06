const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestamosController');

router.get('/', controller.getPrestamos);
router.get('/:id', controller.getPrestamo);
router.post('/', controller.createPrestamo);
router.put('/:id', controller.updatePrestamo);
router.delete('/:id', controller.deletePrestamo);

module.exports = router;
