const express = require('express');
const router = express.Router();
const controller = require('../controllers/autoresController');

router.get('/', controller.getAutores);
router.get('/:id', controller.getAutor);
router.post('/', controller.createAutor);
router.put('/:id', controller.updateAutor);
router.delete('/:id', controller.deleteAutor);

module.exports = router;
