const express = require('express');
const router = express.Router();
const boletimController = require('../controllers/boletimController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', boletimController.store);
router.get('/:id', boletimController.show);
router.get('/aluno/:aluno_id', boletimController.index);