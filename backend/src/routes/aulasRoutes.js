const express = require('express');
const router = express.Router();
const aulaController = require('../controllers/aulaController');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

router.post('/', verificarToken, verificarAdmin, aulaController.store);
router.get('/', verificarToken, verificarAdmin, aulaController.index);
router.get('/:id', verificarToken, verificarAdmin, aulaController.show);
router.delete('/:id', verificarToken, verificarAdmin, aulaController.destroy);

////////////////////////////////////////////////////////////////////////////////////////////////

//Rota de registrar presenca na tela de presencas
router.post('/:id/presencas', verificarToken, verificarAdmin, aulaController.registrarPresenca);

//Rota de carregar alunos na tela de presencas
router.get('/:id/alunos', verificarToken, verificarAdmin, aulaController.listarAlunosDaAula);

//Rota de buscar presencas dos alunos 
router.get('/:id/presencas', verificarToken, verificarAdmin, aulaController.buscarPresencasDaAula);

module.exports = router;