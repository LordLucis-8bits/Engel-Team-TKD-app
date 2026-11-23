const db = require('../config/db');

const BoletimModel = {
  async acresentarBoletim(dados) {
    const { aluno_id, periodo, media_geral, faltas_escolares, foto_boletim } = dados;
    const query = `
      INSERT INTO boletins (aluno_id, periodo, media_geral, faltas_escolares, foto_boletim)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await db.query(query, [aluno_id, periodo, media_geral, faltas_escolares, foto_boletim]);
    return result.rows[0];
  },

  async listarPorAluno(aluno_id) {
    const query = 'SELECT * FROM boletins WHERE aluno_id = $1 ORDER BY created_at DESC;';
    const result = await db.query(query, [aluno_id]);
    return result.rows;
  }
};
module.exports = BoletimModel;