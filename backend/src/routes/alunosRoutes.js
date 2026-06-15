const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const verificarToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', upload.single('foto'), alunoController.store);
router.post('/login', alunoController.login);
router.get('/perfil', verificarToken, alunoController.show);
router.put('/:id', verificarToken, upload.single('foto'), alunoController.update);
router.get('/', verificarToken, alunoController.index);

module.exports = router;