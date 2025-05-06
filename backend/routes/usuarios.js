const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosController');

router.get('/', controller.getUsuarios);
router.get('/:id', controller.getUsuario);
router.post('/', controller.createUsuario);
router.put('/:id', controller.updateUsuario);
router.delete('/:id', controller.deleteUsuario);

module.exports = router;
