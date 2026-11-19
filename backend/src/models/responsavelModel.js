const db = require('./db');

const ResponsavelModel = {
    async cadastrar(dados) {
        const { nome, email, senha, role } = dados;
        
        const query = `
            INSERT INTO users (nome, email, senha, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, email, role; 
        `;
        
        const values = [nome, email, senha, role];
        const result = await db.query(query, values);
        
        if (result.rows.length === 0) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return result.rows[0];
    },

    async buscarPorEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1;';
        const result = await db.query(query, [email]);
        return result.rows[0] || null;
    },

    async buscarPorId(id) {
        const query = 'SELECT id, nome, email, role FROM users WHERE id = $1;';
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    }
};

module.exports = ResponsavelModel;