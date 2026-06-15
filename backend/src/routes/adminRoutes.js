const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');

router.post('/login', adminController.login);
router.get('/', verificarToken, verificarAdmin, adminController.index);
router.get('/:id', verificarToken, verificarAdmin, adminController.show);
router.put('/:id', verificarToken, verificarAdmin, adminController.update);
router.delete('/:id', verificarToken, verificarAdmin, adminController.destroy);

module.exports = router;