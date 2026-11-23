const db = require('../config/db');

const CompeticaoModel = {
  async adicionarCompeticao(dados) {
    const { aluno_id, nome_campeonato, data_competicao, colocacao, pontos } = dados;
    const query = `
      INSERT INTO competicoes (aluno_id, nome_campeonato, data_competicao, colocacao, pontos)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await db.query(query, [aluno_id, nome_campeonato, data_competicao, colocacao, pontos]);
    return result.rows[0];
  },

  async listarRanking() {
    //Agrupa os pontos por aluno e ordena do maior para o menor
    const query = `
      SELECT a.nome, SUM(c.pontos) as total_pontos 
      FROM competicoes c
      JOIN alunos a ON a.id = c.aluno_id
      GROUP BY a.nome
      ORDER BY total_pontos DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  }
};
module.exports = CompeticaoModel;