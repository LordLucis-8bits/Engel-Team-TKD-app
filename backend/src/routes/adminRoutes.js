const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

router.use(auth, verificarAdmin);

router.get('/alunos', adminController.index);
router.post('/alunos', adminController.store);
router.put('/alunos/:id', adminController.update);
router.delete('/alunos/:id', adminController.destroy);
router.get('/alunos/:id', adminController.show);

module.exports = router;