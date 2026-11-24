const express = require('express');
const router = express.Router();
const reforcoController = require('../controllers/reforcoController');
const auth = require('../middleware/auth');
const verificarProfessor = require('../middleware/verificarProfessor');

router.use(auth, verificarProfessor);

router.get('/aluno/:id', reforcoController.index); 
router.post('/', reforcoController.store); 

module.exports = router;