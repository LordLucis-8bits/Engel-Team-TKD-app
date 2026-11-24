const boletimModel = require('../models/boletimModel');
const { formatarBoletim } = require('../utils/formatters');

const boletimController = {
    async store(req, res) {
        try {
            const { aluno_id, periodo, media_geral, faltas_escolares } = req.body;

            if (!aluno_id || !periodo || !faltas_escolares || !media_geral) {           
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }
       
            if (isNaN(media_geral)) {            
                return res.status(400).json({ error: 'Média deve ser um número' });       
            }

            const aluno = await alunoModel.buscarAlunoPorId(aluno_id, req.user.id);

            if (!aluno) { 
                return res.status(403).json({ error: 'Acesso negado. Este aluno não pertence a você.' });
            }
            
            const foto_boletim = req.file ? req.file.filename : null;
            
            const boletim = await boletimModel.acresentarBoletim({           
                aluno_id,          
                periodo,           
                media_geral,            
                faltas_escolares,           
                foto_boletim  
            });
       
            res.status(201).json({       
                message: 'Boletim cadastrado com sucesso',        
                boletim: formatarBoletim(boletim) 
            });
        
        } catch (err) { 
            console.error('Erro ao criar boletim:', err);   
            res.status(500).json({ error: 'Erro ao criar boletim' });
        }
    },
    
    async show(req, res) {
        const boletim = await boletimModel.buscarPorId(req.params.id);
        
        if (!boletim) {
            return res.status(404).json({ error: 'Boletim não encontrado' });
        }

        if (req.user.role === 'responsavel') {

            const aluno = await alunoModel.buscarAlunoPorId(boletim.aluno_id, req.user.id);
        
            if (!aluno) { 
                return res.status(403).json({ error: 'Acesso negado. Este boletim não é do seu filho.' });
            }
        }
        return res.json(boletim);
    }
}

module.exports = boletimController;