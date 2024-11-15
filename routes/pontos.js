const express = require('express');
const router = express.Router();
const pontosController = require('../controllers/pontosController');

router.get('/', pontosController.getAll);
router.get('/:idFuncionario', pontosController.getByIdUser);
router.post('/status', pontosController.getAllByStatus);
router.post('/', pontosController.create);
router.put('/status/update', pontosController.updateStatus);
router.put('/solicitacao', pontosController.requestEdit);
router.put('/', pontosController.update);
router.delete('/', pontosController.deleteAll);

module.exports = router;