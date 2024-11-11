const express = require('express');
const router = express.Router();
const pontosController = require('../controllers/pontosController');

router.get('/', pontosController.getAll);
router.post('/', pontosController.create);

module.exports = router;