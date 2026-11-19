# 🥋 Engel Team Conecta
Plataforma de gestão socioeducacional e esportiva para a equipe de artes marciais Engel Team. O sistema conecta a administração da equipe, os pais/responsáveis e os professores de reforço, com o objetivo de acompanhar a evolução educacional e esportiva dos jovens atletas.

## 🎯 Objetivo do Projeto
Centralizar dados escolares, de reforço, frequência em treinos e resultados de competições em uma única plataforma. A finalidade principal é gerar diagnósticos de evolução (via PDF) para apresentar à Secretaria e à prefeitura, comprovando o impacto social do esporte na educação.

## 👥 Perfis de Acesso
O sistema possui 3 níveis de permissão:
1. **Admin (Equipe Engel):** Controle total. Cadastra alunos, lança presenças, competições e gera relatórios.
2. **Responsável (Pai/Mãe):** Acesso restrito. Vê apenas os dados do(s) seu(s) filho(s), envia boletins escolares e acompanha o ranking.
3. **Professor de Reforço:** Acesso restrito. Lança a evolução semanal dos alunos no reforço escolar.

(Nota: O aluno/atleta não possui login próprio, sendo gerenciado pelo responsável).

## 🛠️ Tecnologias Utilizadas
**Backend:**
*   Node.js + Express
*   PostgreSQL (banco de dados relacional)
*   JWT (Autenticação via token)
*   Bcrypt (Criptografia de senhas)
*   Multer (Upload de fotos de perfil e boletins)

**Mobile:**
*   React Native + Expo
*   React Navigation

## 📂 Estrutura de Pastas
```text
Engel_Team_TKD_app/
├── backend/             # API REST em Express
│   ├── src/
│   │   ├── config/      # Configurações de upload
│   │   ├── controllers/ # Lógica das rotas
│   │   ├── middleware/  # Autenticação e permissões
│   │   ├── models/      # Queries SQL e abstração do banco
│   │   ├── routes/      # Definição dos endpoints
│   │   └── utils/       # Validações e formatação de dados
│   └── db/              # Tabela SQL (init.sql)
│
└── mobile/              # Aplicativo Expo
    ├── src/
    │   ├── assets/      # Imagens e fontes
    │   ├── screens/     # Telas do app (admin, responsavel, professor)
    │   |── utils/       # Validações e formatação de dados
    |___└── App.js       # Entrada do app

Modelagem do Banco de Dados (Principais Tabelas)

| users: Usuários do sistema (Admin, Responsável, Professor).

| alunos: Dados dos atletas (vinculados ao responsavel_id).

| aulas e presencas: Controle de frequência nos treinos.

| boletins: Notas e faltas escolares enviadas pelo pai (2x ao ano).

| reforcos: Evolução pedagógica lançada pelo professor.

| competicoes: Histórico de medalhas e pontuação para o ranking.

//////////////////////////////////////////////////////////////////////////////

Como rodar o projeto localmente

Pré-requisitos

Node.js instalado

PostgreSQL instalado e rodando (ou Docker)

//////////////////////////////////////////////////////////////////////////////

Passo a passo (Backend)

Acesse a pasta do backend: cd backend

Instale as dependências: npm install

|Configure o arquivo .env com as variáveis:

|env

|PORT=3000

|DATABASE_URL=DB_engel_team_tkd

|JWT_SECRET=U8z3!sKp@91aX#vWm$FqRtG4eLpNz2Hb

Execute o script db/init.sql no seu PostgreSQL para criar as tabelas.

Inicie o servidor: npm run dev (ou node src/app.js)

//////////////////////////////////////////////////////////////////////////////

Passo a passo (Mobile)

Acesse a pasta do mobile: cd mobile

Instale as dependências: npm install

Inicie o Expo: npx expo start

Abra no emulador ou leia o QR Code com o aplicativo Expo Go.

Status do Projeto
Em desenvolvimento (Refatoração)


