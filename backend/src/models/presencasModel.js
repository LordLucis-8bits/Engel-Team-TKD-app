const db = require('./db');

const presencasModel = {
    async registrarPresenca(aula_Id, aluno_Id, presente) {
        const query = `
            INSERT INTO presencas (aula_Id, aluno_Id, presente)
            VALUES ($1, $2, $3)
            ON CONFLICT (aula_Id, aluno_Id) DO UPDATE SET presente = $3
            RETURNING *;
        `;

        const result = await db.query(query, [aulaId, alunoId, presente]);
        return result.rows[0];
    },

    async BuscarPresencaPorAula(aula_id) {
        const query = `
            SELECT p.*, a.nome, a.faixa, a.tipoFaixa, a.foto
            FROM presencas p
            JOIN alunos a ON p.aluno_id = a.id
            WHERE p.aula_id = $1;
            ORDER BY a.nome; 
        `;

        const result = await db.query(query, [aula_id]);
        return result.rows;
    },

    async BuscarPresencaPorAluno(aluno_id) {
        const query = `
            SELECT p.*, au.titulo, au.data, au.horario_inicio, au.tipo_faixa
            FROM presencas p
            JOIN aulas au ON p.aula_id = au.id
            WHERE p.aluno_id = $1
            ORDER BY au.data DESC;
        `;

        const result = await db.query(query, [aluno_id]);
        return result.rows;
    },

    async TotalPresencasDeAluno(aluno_id) {
        const query = `
            SELECT COUNT(*) AS total
            FROM presencas
            WHERE aluno_id = $1 AND presente = true;
        `;

        const result = await db.query(query, [aluno_id]);
        return parseInt(result.rows[0].total);
    }
};

module.exports = presencasModel;