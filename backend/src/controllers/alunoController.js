const alunoModel = require('../models/alunoModel');
const { formatarAluno, parseDataNascimento } = require('../utils/formatters');

const alunoController = {
  async show(req, res) {
    try {
      const id = req.params.id;
      
      const aluno = await alunoModel.buscarAlunoPorId(id, req.user.id);
      
      if (!aluno) {
        return res.status(403).json({ error: 'Acesso negado ou aluno não encontrado' });
      }
      
      res.json(formatarAluno(aluno));
    } catch (err) {
      console.error('Erro ao buscar perfil do aluno:', err);
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const dadosAtualizados = req.body;

      const alunoExistente = await alunoModel.buscarAlunoPorId(id, req.user.id);
      if (!alunoExistente) {
        return res.status(403).json({ error: 'Acesso negado. Este aluno não é seu filho.' });
      }

      if (dadosAtualizados.dataNascimento) {
        dadosAtualizados.dataNascimento = parseDataNascimento(dadosAtualizados.dataNascimento);
      }
      
      if (dadosAtualizados.altura) {
        const altura = parseInt(dadosAtualizados.altura, 10);
        if (altura < 50 || altura > 250) {
          return res.status(400).json({ error: 'Altura deve estar entre 50cm e 250cm' });
        }
      }

      if (req.file) {
        dadosAtualizados.foto = req.file.filename;
      }

      const dadosMergeados = { ...alunoExistente, ...dadosAtualizados };
      const alunoAtualizado = await alunoModel.atualizarAluno(id, dadosMergeados);

      res.json({
        message: `Dados de ${alunoAtualizado.nome} atualizados com sucesso`,
        aluno: formatarAluno(alunoAtualizado)
      });

    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
  }
};

module.exports = alunoController;