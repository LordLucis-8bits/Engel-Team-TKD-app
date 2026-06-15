const alunoModel = require('../models/alunoModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { formatarAluno } = require('../utils/formatters');
const { validateEmail } = require('../utils/validators');
const { parseDataNascimento } = require('../utils/formatters');

require('dotenv').config();

const alunoController = {
  async store(req, res) {
    try {
      const dados = req.body;

      if (!dados.nome || !dados.email || !dados.senha) {
        return res.status(400).json({ 
          error: 'Nome, email e senha são obrigatórios' 
        });
      }

      if (!validateEmail(dados.email)) {
        return res.status(400).json({ 
          error: 'Email inválido' 
        });
      }

      if (dados.senha.length < 6) {
        return res.status(400).json({ 
          error: 'Senha deve ter no mínimo 6 caracteres' 
        });
      }

      const alunoExistente = await alunoModel.buscarAlunoPorEmail(dados.email);
      if (alunoExistente) {
        return res.status(409).json({ error: 'Este email já está cadastrado' });
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
      dados.senha = await bcrypt.hash(dados.senha, 10);

      //Depois de todas as validações, aluno é cadastrado no banco
      const aluno = await alunoModel.cadastrarAlunos(dados);

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso',
        aluno: formatarAluno(aluno),
        token: jwt.sign(
          { id: aluno.id, tipo: 'aluno' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
      });
      
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      res.status(500).json({ error: 'Erro ao cadastrar aluno', 
      detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
  },

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

      const aluno = await alunoModel.buscarAlunoPorEmail(email);

      if (!aluno) {
        return res.status(401).json({ 
          error: 'Email ou senha inválidos' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, aluno.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: aluno.id, tipo: 'aluno' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login bem-sucedido',
        token,
        tipo: 'aluno',
        id: aluno.id,
        aluno: formatarAluno(aluno)
      });

    } catch (err) {
      console.error('Erro no login do aluno:', err);
      return res.status(500).json({ 
        error: 'Erro ao fazer login',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
  },
  
  async show(req, res) {
    try {
      const id = req.user.id;
      
      if (!id) {
        return res.status(400).json({ error: 'ID inválido no token' });
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

      if (req.user.tipo === 'aluno' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Sem permissão para editar o aluno' })
      }

      delete dadosAtualizados.id;
      delete dadosAtualizados.tipo;

      if (dadosAtualizados.email && dadosAtualizados.email !== alunoExistente.email) {
        if (!validateEmail(dadosAtualizados.email)) {
          return res.status(400).json({ error: 'Email inválido' });
        }
        
        const emailEmUso = await AlunoModel.buscarAlunoPorEmail(dadosAtualizados.email);
        if (emailEmUso) {
          return res.status(409).json({ error: 'Este email já está em uso' });
        }
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

      //Hash se enviar senha nova
      if (dadosAtualizados.senha) {
        if (dadosAtualizados.senha.length < 6) {
          return res.status(400).json({ error: 'Nova senha deve ter no mínimo 6 caracteres' });
        }

        dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.senha, 10);
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