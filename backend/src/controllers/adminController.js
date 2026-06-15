const alunoModel = require('../models/alunoModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { formatarAluno } = require('../utils/formatters');
const { validateEmail } = require('../utils/validators');

require('dotenv').config();

const adminController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const senhaValida = await bcrypt.compare(senha, process.env.ADMIN_PASSWORD_HASH);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { tipo: 'admin', email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login admin bem-sucedido',
        token,
        tipo: 'admin',
        id: 'admin'
      });
      
    } catch (err) {
      console.error('Erro no login do admin:', err);
      return res.status(500).json({ 
        error: 'Erro ao fazer login',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },
  
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const alunos = await alunoModel.listarAlunos(page, limit);
      
      const alunosComFoto = alunos.map(formatarAluno);
      return res.json(alunosComFoto);
    
    } catch (err) {
      console.error('Erro ao listar alunos:', err);
      res.status(500).json({ error: 'Erro ao listar alunos' });
    }
  },

  async show(req, res) {
    try {
      const id = req.params.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const aluno = await alunoModel.buscarAlunoPorId(id);

      if (!aluno) { 
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json(formatarAluno(aluno));
    } catch (err) {
      console.error('Erro ao buscar aluno por ID:', err);
      res.status(500).json({ 
        error: 'Erro ao buscar aluno por ID',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const dadosAtualizados = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const alunoExistente = await alunoModel.buscarAlunoPorId(id);
      if (!alunoExistente) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      if (dadosAtualizados.senha) {
        delete dadosAtualizados.senha;
      }

      if (dadosAtualizados.email && dadosAtualizados.email !== alunoExistente.email) {
        if (!validateEmail(dadosAtualizados.email)) {
          return res.status(400).json({ error: 'Email inválido' });
        }
        const emailEmUso = await alunoModel.buscarAlunoPorEmail(dadosAtualizados.email);
        if (emailEmUso) {
          return res.status(409).json({ error: 'Este email já está em uso' });
        }
      }

      if (dadosAtualizados.altura) {
        const altura = parseInt(dadosAtualizados.altura, 10);
        if (altura < 50 || altura > 250) {
          return res.status(400).json({ error: 'Altura deve estar entre 50cm e 250cm' });
        }
      }

      const dadosMergeados = {
        ...alunoExistente,
        ...dadosAtualizados,
        senha: alunoExistente.senha, // admin nunca altera senha
      };

      const alunoAtualizado = await alunoModel.atualizarAluno(id, dadosMergeados);

      res.json({
        message: 'Aluno atualizado com sucesso',
        aluno: formatarAluno(alunoAtualizado)
      });
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).json({ 
        error: 'Erro ao atualizar aluno',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const aluno = await alunoModel.buscarAlunoPorId(id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const alunoDeletado = await alunoModel.excluirAluno(id);
      
      res.json({
        message: `Aluno ${aluno.nome} deletado com sucesso`,
        aluno: formatarAluno(alunoDeletado)
      });
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
      res.status(500).json({ 
        error: 'Erro ao deletar aluno',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};

module.exports = adminController;