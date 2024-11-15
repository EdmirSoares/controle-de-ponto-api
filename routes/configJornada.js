const express = require('express');
const router = express.Router();
const configJornadaController = require('../controllers/configJornadaController');

router.get('/:idFuncionario', configJornadaController.getAll);

module.exports = router;