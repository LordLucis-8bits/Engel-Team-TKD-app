const db = require('./db');

const AulaModel = {
    async criarAula(dados) {
        const {
            titulo,
            data,
            horario_inicio,
            horario_fim,
            instrutor,
            tipo_faixa,
        } = dados;

        const query = `
            INSERT INTO aulas (titulo, data, horario_inicio, horario_fim, instrutor, tipo_faixa)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            titulo,
            data,
            horario_inicio,
            horario_fim,
            instrutor,
            tipo_faixa,
        ];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Erro ao cria aula');
        }
        return result.rows[0];
    },

    async listarAulas(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await db.query('SELECT * FROM aulas LIMIT $1 OFFSET $2;', [limit, offset]);
        return result.rows;
    },

    async buscarPorId(id) {
        const query = 'SELECT * FROM aulas WHERE id = $1;';
        const values = [id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Aula não encontrada');
        }
        return result.rows[0];
    },

    async BuscarAlunosPorAulas(aula_Id, tipo_faixa) {
        let query = 'SELECT * FROM alunos'
        const values = []

        if (tipo_faixa && tipo_faixa !== 'Todas') {
            query += 'WHERE tipoFaixa = $1'
            values.push(tipo_faixa)
        }

        const result = await db.query(query, values);
        return result.rows;
    },

    async excluirAula(id) {
        const query = 'DELETE FROM aulas WHERE id = $1 RETURNING *;';
        const values = [id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Aula não encontrada');
        }
        return result.rows[0];
    }
};

module.exports = AulaModel;