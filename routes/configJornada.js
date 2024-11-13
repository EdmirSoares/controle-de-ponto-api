const express = require('express');
const router = express.Router();
const configJornadaController = require('../controllers/configJornadaController');

router.get('/', configJornadaController.getAll);
router.post('/', configJornadaController.create);
router.put('/', configJornadaController.update);
router.delete('/', configJornadaController.delete);

module.exports = router;