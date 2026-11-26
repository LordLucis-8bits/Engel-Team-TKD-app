const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const auth = require('../middleware/auth');
const upload = require('../config/uploadConfig'); 

//O pai logado vai usar essas rotas que só ve info do proprio filho
router.use(auth);
router.get('/:id', alunoController.show);
router.put('/:id', upload.single('foto'), alunoController.update);

module.exports = router;