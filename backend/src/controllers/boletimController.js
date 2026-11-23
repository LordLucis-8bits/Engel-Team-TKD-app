const boletimModel = require("../models/boletimModel");

const boletimController = {
    
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