const db = require("../config/db");

const ReforcoModel = {
  async adicionarReforco(dados) {
    const { aluno_id, professor_id, materia, evolucao } = dados;
    const query = `
      INSERT INTO reforcos (aluno_id, professor_id, materia, evolucao)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await db.query(query, [aluno_id, professor_id, materia, evolucao]);
    return result.rows[0];
  },

  async listarPorAluno(aluno_id) {
    const query = 'SELECT * FROM reforcos WHERE aluno_id = $1 ORDER BY data_lancamento DESC;';
    const result = await db.query(query, [aluno_id]);
    return result.rows;
  }
};
module.exports = ReforcoModel;