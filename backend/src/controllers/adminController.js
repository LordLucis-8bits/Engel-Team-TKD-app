const alunoModel = require('../models/alunoModel');
const { formatarAluno } = require('../utils/formatters');
require('dotenv').config();

const adminController = {
  async index(req, res) {
    try {
      const alunos = await alunoModel.listarAlunos(1, 100); 
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
      const aluno = await alunoModel.buscarAlunoPorId(id);

      if (!aluno) { 
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json(formatarAluno(aluno));
    } catch (err) {
      console.error('Erro ao buscar aluno por ID:', err);
      res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
  },

  async store(req, res) {
    try {
      const dados = req.body;

      if (!dados.nome || !dados.idade) {
        return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
      }

      dados.foto = req.file ? req.file.filename : 'default-photo-user.png';

      const aluno = await alunoModel.cadastrarAlunos(dados);

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso',
        aluno: formatarAluno(aluno)
      });
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      res.status(500).json({ error: 'Erro ao cadastrar aluno', detalhes: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const dadosAtualizados = req.body;

      const alunoExistente = await alunoModel.buscarAlunoPorId(id);
      if (!alunoExistente) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      if (req.file) {
        dadosAtualizados.foto = req.file.filename;
      }

      const dadosMergeados = { ...alunoExistente, ...dadosAtualizados };
      const alunoAtualizado = await alunoModel.atualizarAluno(id, dadosMergeados);

      res.json({
        message: 'Aluno atualizado com sucesso',
        aluno: formatarAluno(alunoAtualizado)
      });
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).json({ error: 'Erro ao atualizar aluno', detalhes: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const aluno = await alunoModel.buscarAlunoPorId(id);
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      await alunoModel.excluirAluno(id);
      res.json({ message: `Aluno ${aluno.nome} deletado com sucesso` });
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
      res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
  }
};

module.exports = adminController;