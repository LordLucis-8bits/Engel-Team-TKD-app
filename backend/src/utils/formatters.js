function formatarAluno(aluno) {
    if (!aluno) return null;
    aluno.fotoUrl = aluno.foto 
    ? `${process.env.API_URL}/uploads/alunos/${aluno.foto}` 
    : `${process.env.API_URL}/uploads/default-photo-user.png`;
    return aluno;
}

function formatarBoletim(boletim) {
    if (!boletim) return null;
    boletim.url_boletim = boletim.foto_boletim 
    ? `${process.env.API_URL}/uploads/boletins/${boletim.foto}` 
    : null;
    return boletim;
}

function parseDataNascimento(dataStr) {
    if (!dataStr) {
        throw new Error("Data obrigatória");
    }
  
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dataStr)) {
        throw new Error("Data deve estar no formato DD-MM-YYYY");
    }

    const [dia, mes, ano] = dataStr.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    if (data.getDate() !== dia || data.getMonth() !== mes - 1) {
        throw new Error("Data inválida");
    }
    return data;
};

module.exports = { formatarAluno, parseDataNascimento, formatarBoletim };