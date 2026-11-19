const alunoModel = require('../models/alunoModel');;
const { formatarAluno, parseDataNascimento } = require('../utils/formatters');
require('dotenv').config();

const alunoController = {
  async store(req, res) {
    try {
      const dados = req.body;

      if (!dados.nome || !dados.idade) {
        return res.status(400).json({ 
          error: 'Nome, email e senha são obrigatórios' 
        });
      }

      if (dados.dataNascimento) {
        dados.dataNascimento = parseDataNascimento(dados.dataNascimento);
      }

      if (dados.altura) {
        const altura = parseInt(dados.altura, 10);
        if (altura < 50 || altura > 250) {
          return res.status(400).json({ error: 'Altura deve estar entre 50cm e 250cm' });
        }
      }

      dados.foto = req.file ? req.file.filename : 'default-photo-user.png';

      //Depois de todas as validações, aluno é cadastrado no banco
      const aluno = await alunoModel.cadastrarAlunos(dados);

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso',
        aluno: formatarAluno(aluno)
      });
      
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      res.status(500).json({ error: 'Erro ao cadastrar aluno', 
      detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
  },

  async show(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      
      const aluno = await alunoModel.buscarAlunoPorId(id);
      res.json(formatarAluno(aluno));
    
    } catch (err) {
      console.error('Erro ao buscar perfil do aluno:', err);
      res.status(500).json({ 
        error: 'Erro ao buscar perfil', 
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  },

  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const alunos = await alunoModel.listarAlunos(page, limit);

      const lista = alunos.map(formatarAluno);

      res.json(lista);

    } catch (err) {
      console.error('Erro ao listar alunos:', err);
      res.status(500).json({ error: 'Erro ao listar alunos' });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const dadosAtualizados = { ...req.body };

      const alunoExistente = await alunoModel.buscarAlunoPorId(id);

      if (!alunoExistente) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      if (req.user.tipo === 'responsavel' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Sem permissão para editar o aluno' })
      }

      delete dadosAtualizados.id;
      delete dadosAtualizados.tipo;

      if (dadosAtualizados.dataNascimento) {
        dadosAtualizados.dataNascimento = parseDataNascimento(dadosAtualizados.dataNascimento);
      }

      if (dadosAtualizados.idade) {
        const idade = parseInt(dadosAtualizados.idade, 10);
        if (idade < 1 || idade > 100) {
          return res.status(400).json({ error: 'Idade deve estar entre 1 e 100 anos' });
        }
      }

      if (dadosAtualizados.altura) {
        const altura = parseInt(dadosAtualizados.altura, 10);
        if (altura < 50 || altura > 250) {
          return res.status(400).json({ error: 'Altura deve estar entre 50cm e 250cm' });
        }
      }

      //Foto nova
      if (req.file) {
        dadosAtualizados.foto = req.file.filename;
      }

      const dadosMergeados = { 
        ...alunoExistente, 
        ...dadosAtualizados,
       senha: dadosAtualizados.senha || alunoExistente.senha,
      };

      //Atualiza no banco
      const alunoAtualizado = await alunoModel.atualizarAluno(id, dadosMergeados);

      //Identificar campos alterados
      const camposAlterados = [];
      for (const campo in dadosAtualizados) {
        if (campo === 'senha') continue; //Não expor campo de senha no log de alterações
        const antes = String(alunoExistente[campo] || '');
        const depois = String(dadosAtualizados[campo] || '');
        if (antes !== depois) {
          camposAlterados.push(campo);
        }
      }

      res.json({
        message: `Aluno ${alunoAtualizado.nome} atualizado com sucesso`,
        camposAlterados,
        aluno: formatarAluno(alunoAtualizado)
      });

    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).json({ 
        error: 'Erro ao atualizar aluno',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};

module.exports = alunoController;