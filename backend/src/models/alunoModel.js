const db = require('./db');

const AlunoModel = {
    async cadastrarAlunos(dados) {
        const {
            nome,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
            bolsa_atleta,
            responsavel_id,
        } = dados;

        const query = `
            INSERT INTO alunos (nome, dataNascimento, sexo, faixa, tipoFaixa, categoria, altura, foto, cidade, estado, bolsa_atleta, responsavel_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;

        const values = [
            nome,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
            bolsa_atleta,
            responsavel_id,
        ];

        const result = await db.query(query, values);
        if (result.rows.length === 0) { 
            throw new Error('Erro ao cadastrar aluno');
        }
        return result.rows[0];
    },

    async listarAlunos(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await db.query('SELECT * FROM alunos LIMIT $1 OFFSET $2;', [limit, offset])
        return result.rows;
    },

    async buscarAlunoPorId(id) {
        const query = 'SELECT * FROM alunos WHERE id = $1;';
        const values = [id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Aluno não encontrado');
        }
        return result.rows[0];
    },

    async buscarAlunoPorEmail(email) {
        const query = 'SELECT * FROM alunos WHERE email = $1;';
        const values = [email];
        const result = await db.query(query, values);
        return result.rows[0] || null;
    },
    
    async atualizarAluno(id, dadosAtualizados) {
        const {
            nome,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
            bolsa_atleta,
        } = dadosAtualizados;

        const query = `
            UPDATE alunos SET nome = $1, dataNascimento = $2, sexo = $3, faixa = $4, tipoFaixa = $5, categoria = $6,
            altura = $7, foto = $8, cidade = $9, estado = $10, bolsa_atleta = $12 WHERE id = $13    
            RETURNING *;
        `;

        const values = [
            nome,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
            bolsa_atleta,
            id,
        ];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Aluno não encontrado');
        }
        return result.rows[0];
    },

    async excluirAluno(id) {
        const query = 'DELETE FROM alunos WHERE id = $1 RETURNING *;';
        const values = [id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Aluno não encontrado');
        }
        return result.rows[0];
    }
};

module.exports = AlunoModel;