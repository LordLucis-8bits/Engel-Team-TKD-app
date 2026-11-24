const aulaModel = require('../models/aulaModel');
const presencasModel = require('../models/presencasModel');

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
            res.status(500).json({ error: 'Erro ao listar aulas' }); 
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params; 

            const aula = await aulaModel.buscarPorId(id);
            
            if (!aula) {
                return res.status(404).json({ error: 'Aula não encontrada' });
            }
            
            res.json({ aula });

        } catch (err) {
            console.error('Erro ao buscar aula:', err);
            res.status(500).json({ error: 'Erro ao buscar aula' });
        }
    },

    async destroy(req, res) {
        try {
            const { id } = req.params; // Corrigido

            const aula = await aulaModel.excluirAula(id);
            res.json({ message: 'Aula excluída com sucesso', aula });
        
        } catch (err) {
            console.error('Error ao excluir aula', err);
            res.status(500).json({ error: 'Erro ao apagar a aula' }); 
        }
    },

    async listarAlunosDaAula(req, res) {
        try {
            const { id } = req.params; 
            const aula = await aulaModel.buscarPorId(id);

            if (!aula) {
                return res.status(404).json({ error: 'Aula não encontrada' });
            }

            const alunos = await aulaModel.BuscarAlunosPorAulas(aula.tipo_faixa);
            res.json({ alunos });

        } catch (err) {
            console.error('Error ao listar alunos das aulas', err);
            res.status(500).json({ error: 'Erro ao listar alunos de aulas' })
        }
    },

    async registrarPresenca(req, res) {
        try {
            const { id } = req.params;
            const { aluno_id, presente } = req.body;

            if (!aluno_id || presente === undefined) {
                return res.status(400).json({ error: 'Aluno_id e presente são obrigatórios' })
            }

            const presenca = await presencasModel.registrarPresenca(id, aluno_id, presente);
            
            // Corrigido: Retornando a variável correta
            res.json({ message: 'Presença registrada', presenca });

        } catch (err) {
            console.error('Erro ao registrar presença', err);
            res.status(500).json({ error: 'Erro ao registrar presença' });
        }
    },

    async buscarPresencasDaAula(req, res) {
        try {
            const { id } = req.params; 

            const presencas = await presencasModel.buscarPresencasDaAula(id);
            res.json(presencas);

        } catch (err) {
            console.error('Erro ao buscar presenças:', err);
            res.status(500).json({ error: 'Erro ao buscar presenças' });
        }
    }
};

module.exports = aulaController;