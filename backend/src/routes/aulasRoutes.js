const express = require('express');
const router = express.Router();
const aulaController = require('../controllers/aulaController');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

router.use(verificarToken, verificarAdmin);

router.post('/:id/presencas', aulaController.registrarPresenca);
router.get('/:id/alunos', aulaController.listarAlunosDaAula);
router.get('/:id/presencas', aulaController.buscarPresencasDaAula);

router.post('/', aulaController.store);
router.get('/', aulaController.index);
router.get('/:id', aulaController.show);
router.delete('/:id', aulaController.destroy);

module.exports = router;