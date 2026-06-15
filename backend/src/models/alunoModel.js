const db = require('./db');

const AlunoModel = {
    async cadastrarAlunos(dados) {
        const {
            nome,
            email,
            senha,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
        } = dados;

        const query = `
            INSERT INTO alunos (nome, email, senha, dataNascimento, sexo, faixa, tipoFaixa, categoria, altura, foto, cidade, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;

        const values = [
            nome,
            email,
            senha,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
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
            email,
            senha,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
        } = dadosAtualizados;

        const query = `
            UPDATE alunos SET nome = $1, email = $2, senha = $3, dataNascimento = $4,
            sexo = $5, faixa = $6, tipoFaixa = $7, categoria = $8,
            altura = $9, foto = $10, cidade = $11, estado = $12 WHERE id = $13    
            RETURNING *;
        `;

        const values = [
            nome,
            email,
            senha,
            dataNascimento,
            sexo,
            faixa,
            tipoFaixa,
            categoria,
            altura,
            foto,
            cidade,
            estado,
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