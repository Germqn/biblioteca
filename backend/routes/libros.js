const express = require('express');
const router = express.Router();  
const librosController = require('../controllers/librosController');

router.get('/', librosController.getLibros);
router.get('/:id', librosController.getLibro);
router.post('/', librosController.createLibro);
router.put('/:id', librosController.updateLibro);
router.delete('/:id', librosController.deleteLibro);

module.exports = router;