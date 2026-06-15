const aulaModel = require('../models/aulaModel');
const alunoModel = require('../models/alunoModel');
const presencasModel = require('../models/presencasModel');
const AulaModel = require('../models/aulaModel');

const aulaController = {
    async store(req, res) {
        try {
            const dados = req.body;

            if (!dados.titulo || !dados.data || !dados.horario_inicio || !dados.horario_fim) {
                return res.status(400).json({ error: 'Titulo, data, horário de início e horário de fim são obrigatórios'})
            }

            const aulaCriada = await aulaModel.criarAula(dados);
            return res.status(201).json({ message: 'Aula criada com sucesso', aulaCriada });

        } catch (err) {
            console.log('Erro ao criar aula', err);
            res.status(500).json({ error: 'Erro ao criar aula' });
        }
    },

    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const aulas = await aulaModel.listarAulas(page, limit);
            res.json({ aulas })
        
        } catch (err) {
            console.log('Erro ao listar aulas', err);
            res.status(500).json({ error: 'erro ao listar alunos' });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params.id;

            const aula = await AulaModel.buscarPorId(id);
            res.json({ aula });

        } catch (err) {
            console.error('Erro ao buscar aula:', err);
            res.status(500).json({ error: 'Erro ao buscar aula' });
        }
    },

    async destroy(req, res) {
        try {
            const { id } = req.params.id;

            const aula = await AulaModel.excluirAula(id);
            res.json({ aula });
        
        } catch (err) {
            console.error('Error ao excluir aula', err);
            res.status(500).json({ erro: 'Erro ao apagar o aluno' });
        }
    },

    async listarAlunosDaAula(req, res) {
        try {
            const { id } = req.params.id;
            const aula = await AulaModel.buscarPorId(id);

            const alunos = await aulaModel.BuscarAlunosPorAulas(id, aula.tipo_faixa);
            res.json({ alunos });

        } catch (err) {
            console.error('Error ao listar alunos das aulas', err);
            res.status(500).json({ error: 'Erro ao listar alunos de aulas' })
        }
    },

    async registrarPresenca(req, res) {
        try {
            const { id } = req.params.id;
            const { aluno_id, presente } = req.body;

            if (!aluno_id || presente === undefined) {
                return res.status(400).json({ error: 'Aluno_id e presente são obrigatório' })
            }

            const presenca = await presencasModel.registrarPresenca(id, aluno_id, presente);
            res.json({ json });

        } catch (err) {
            console.error('Erro ao registra presença', err);
            res.status(500).json({ error: 'Error ao registrar presença' });
        }
    },

    async buscarPresencasDaAula(req, res) {
        try {
            const { id } = req.params;

            const presencas = await PresencaModel.buscarPresencasDaAula(id);
            res.json(presencas);

        } catch (err) {
            console.error('Erro ao buscar presenças:', err);
            res.status(500).json({ error: 'Erro ao buscar presenças' });
        }
    }
};

module.exports = aulaController;