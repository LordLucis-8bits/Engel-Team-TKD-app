const responsavelModel = require('../models/responsavelModel');
const { formatarAluno } = require('../utils/formatters');
require('dotenv').config();

const responsavelController = {

  async buscarPorId(req, res) {
    
    try {
      const { id } = req.user.id;
      const responsavel = await responsavelModel.buscarPorId(id);

      if (!responsavel) {
        return res.status(404).json({ 
          error: 'Responsável não encontrado' 
        });
      }
      
      const responsavelFormatado = formatarAluno(responsavel);
      return res.json(responsavelFormatado);

    } catch (err) {
      console.error('Erro ao buscar responsável por ID:', err);
      return res.status(500).json({ 
        error: 'Erro ao buscar responsável',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const responsavelAtualizado = await responsavelModel.atualizar(id, dadosAtualizados);
      
      if (!responsavelAtualizado) {
        return res.status(404).json({ 
          error: 'Responsável não encontrado para atualização' 
        });
      }

      delete responsavelAtualizado.id;

      const responsavelFormatado = formatarAluno(responsavelAtualizado);
      return res.json(responsavelFormatado);
      
    } catch (err) {
      console.error('Erro ao atualizar responsável:', err);
      return res.status(500).json({ 
        error: 'Erro ao atualizar responsável',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  }
}

module.exports = responsavelController;

