const responsavelModel = require('../models/responsavelModel');
const { formatarResponsavel } = require('../utils/formatters');
require('dotenv').config();

const responsavelController = {
    async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: 'Email inválido' 
        });
      }

      const responsavel = await responsavelModel.buscarPorEmail(email);

      if (!responsavel) {
        return res.status(401).json({ 
          error: 'Email ou senha inválidos' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, responsavel.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: responsavel.id, tipo: 'responsavel' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login bem-sucedido',
        token,
        id: responsavel.id,
        nome: responsavel.nome,
        email: responsavel.email,
        role: responsavel.role
      });

    } catch (err) {
      console.error('Erro no login do aluno:', err);
      return res.status(500).json({ 
        error: 'Erro ao fazer login',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  },
}

module.exports = responsavelController;

