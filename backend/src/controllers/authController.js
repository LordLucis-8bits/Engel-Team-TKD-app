const responsavelModel = require('../models/responsavelModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authController = {
    async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      const usuario = await responsavelModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ 
          error: 'Email inválido' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválido' });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login bem-sucedido',
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            role: usuario.role
        }
      });

    } catch (err) {
      console.error('Erro no login do usuario:', err);
      return res.status(500).json({ 
        error: 'Erro ao fazer login',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  },
}

module.exports = authController;