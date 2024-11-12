const express = require('express');
const router = express.Router();
const pontosController = require('../controllers/pontosController');

router.get('/', pontosController.getAll);
router.get('/:idFuncionario', pontosController.getByIdUser);
router.post('/', pontosController.create);
router.put('/status', pontosController.updateStatus);
router.put('/solicitar', pontosController.requestEdit);
router.put('/', pontosController.update);

module.exports = router;