const competicaoModel = require('../models/competicaoModel');

const competicaoController = {
    async store(req, res) {
        try {
            const { aluno_id, nome_campeonato, data_competicao, colocacao, pontos } = req.body;

            if (!aluno_id || !nome_campeonato || !data_competicao || !colocacao || !pontos) {           
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            if (isNaN(pontos)) {
                return res.status(400).json({ error: 'Pontos deve ser um numero' })
            }

            const competicao = await competicaoModel.adicionarCompeticao({
                aluno_id, 
                nome_campeonato, 
                data_competicao, 
                colocacao, 
                pontos
            });

            res.status(201).json({ message: 'Competição adicionado com sucesso!', competicao })

        } catch (err) {
            console.log('Erro ao adicionar competicao', err);
            res.status(500).json({ error: 'Erro ao adicionar competição', detalhes: err.message })
        }
    },

    async index(req, res) {
        try {     
            const competicao = await competicaoModel.listarRanking();

            res.json(competicao);
        
        } catch (err) {
            console.error('Erro ao listar alunos:', err);
            res.status(500).json({ error: 'Erro ao listar alunos' });   
        }    
    }
}

module.exports = competicaoController;