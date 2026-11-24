const alunoModel = require('../models/alunoModel');
const { formatarAluno } = require('../utils/formatters');

require('dotenv').config();

const adminController = {
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

      if (dadosAtualizados.altura) {
        const altura = parseInt(dadosAtualizados.altura, 10);
        if (altura < 50 || altura > 250) {
          return res.status(400).json({ error: 'Altura deve estar entre 50cm e 250cm' });
        }
      }

      const dadosMergeados = {
        ...alunoExistente,
        ...dadosAtualizados,
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