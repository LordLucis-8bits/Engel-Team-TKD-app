const express = require('express');
const router = express.Router();
const competicaoController = require('../controllers/competicaoController');
const auth = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

router.use(auth);

router.get('/ranking', competicaoController.index); 
router.post('/', verificarAdmin, competicaoController.store); 

module.exports = router;