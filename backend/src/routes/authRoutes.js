const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const adminController = require('../controllers/adminController');

require('dotenv').config();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!validateEmail(email)) { 
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (typeof email !== 'string' || typeof senha !== 'string') {
      return res.status(400).json({ error: 'Email e senha devem ser texto' });
    }

    if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      return adminController.login(req, res);
    }

    return alunoController.login(req, res);

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao processar login. Tente novamente.' });
  }
});

module.exports = router;