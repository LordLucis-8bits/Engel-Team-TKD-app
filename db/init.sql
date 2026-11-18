1. USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'responsavel', 'professor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. ALUNOS 
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    dataNascimento VARCHAR(50),
    sexo VARCHAR(50),
    faixa VARCHAR(100),
    tipoFaixa VARCHAR(50),
    categoria VARCHAR(50),
    altura INTEGER,
    foto TEXT,
    cidade VARCHAR(255),
    estado CHAR(2),
    bolsa_atleta BOOLEAN DEFAULT FALSE,
    responsavel_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3. AULAS
CREATE TABLE IF NOT EXISTS aulas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    instrutor VARCHAR(255),
    tipo_faixa VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. PRESENCAS 
CREATE TABLE IF NOT EXISTS presencas (
    id SERIAL PRIMARY KEY,
    aula_id INTEGER NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    presente BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aula_id, aluno_id)
);

5. BOLETINS ESCOLARES
CREATE TABLE IF NOT EXISTS boletins (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    periodo VARCHAR(50) NOT NULL,
    media_geral NUMERIC(4,2),
    faltas_escolares INTEGER,
    foto_boletim TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

6. REFORÇO ESCOLAR 
CREATE TABLE IF NOT EXISTS reforcos (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    professor_id INTEGER REFERENCES users(id),
    data_lancamento DATE DEFAULT CURRENT_DATE,
    materia VARCHAR(100),
    evolucao TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

7. COMPETIÇÕES
CREATE TABLE IF NOT EXISTS competicoes (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    data_competicao DATE NOT NULL,
    nome_campeonato VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    colocacao INTEGER, 
    pontos INTEGER DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);