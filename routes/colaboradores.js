const express = require('express');
const router = express.Router();
const colaboradoresController = require('../controllers/colaboradoresController');

router.get('/', colaboradoresController.getAll);
router.get('/:idFuncionario', colaboradoresController.getById);
router.post('/', colaboradoresController.create);
router.put('/', colaboradoresController.update);
router.put('/ativo', colaboradoresController.updateStatus);
router.delete('/', colaboradoresController.delete);

module.exports = router;