const express = require('express');
const router = express.Router();
const pontosController = require('../controllers/pontosController');

router.get('/', pontosController.getAll);
router.get('/:idFuncionario', pontosController.getByIdUser);
router.post('/', pontosController.create);
router.put('/', pontosController.update);
router.put('/status', pontosController.updateStatus);
router.put('/solicitar', pontosController.requestEdit);

module.exports = router;