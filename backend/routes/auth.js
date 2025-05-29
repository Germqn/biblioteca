const express = require('express');
const router = express.Router();
const { Redbook } = require('../controllers/authController');

router.post('/Redbook', Redbook);

module.exports = router;
