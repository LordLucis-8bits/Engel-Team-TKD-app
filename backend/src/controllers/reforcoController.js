const reforcoModel = require('../models/reforcoModel');

const reforcoController = {
    async store(req, res) {
        try {
            const { aluno_id, materia, evolucao } = req.body;

            if (!aluno_id || !materia || !evolucao) {           
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const reforco = await reforcoModel.adicionarReforco({
                aluno_id,
                materia,
                professor_id: req.user.id, //Captura id de quem chamou a rota 
                evolucao
            });

            res.status(201).json({ message: 'Reforço criado com sucesso!', reforco })
        
        } catch (err) {
            console.log('Erro ao criar reforço', err);
            res.status(500).json({ error: 'Error ao criar reforço', detalhes: err.message })
        }
    },

    async index(req, res) {
        try {
            const { id } = req.params;
            const aluno = await reforcoModel.listarPorAluno(id, req.user.role === 'responsavel' ? req.user.id : null);
            
            if (!aluno) {
                return res.status(403).json({ error: 'Acesso negado. Este aluno não pertence a você.' });
            }

            const lista = await reforcoModel.listarPorAluno(id)
            res.json({ lista })

        } catch (err) {
            console.log('Erro ao listar reforço', err);
            res.status(500).json({ error: 'Error ao listar reforço', detalhes: err.message })
        }
    }
}

module.exports = reforcoController;