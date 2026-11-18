# 🥋 PROJETO: ENGEL TEAM CONECTA
**Status atual:** Em desenvolvimento (Backend e Mobile iniciados)
**Última atualização:** 18/11/2026

## 1. O OBJETIVO
Plataforma (App Android + API) para a equipe de artes marciais da minha mãe. Ela tem afiliação com a prefeitura e precisa provar a evolução educacional dos jovens através do esporte.
*   **3 Perfis:** Admin (Mãe/Equipe), Pai/Responsável, Professor de Reforço.
*   **5 Abas/Módulos:** Perfil do Atleta, Escola (Boletim), Reforço Escolar, Treino (Frequência), Ranking de Competições.
*   **Entregável final:** PDF de diagnóstico por aluno e geral para apresentar à Secretaria em dez/2027. Teste inicial em jan/2027.

## 2. STACK TECNOLÓGICA DECIDIDA
*   **Backend:** Node.js + Express (MVC) + PostgreSQL. (Decidimos NÃO usar Fastify, pois já temos Express rodando).
*   **Mobile:** React Native + Expo (JS, sem TS por enquanto).
*   **Banco:** PostgreSQL (rodando local via Docker).
*   **Hospedagem:** EAS Build (nuvem) para gerar o APK e testar sem pagar a Play Store.

## 3. ESTRUTURA ATUAL DO PROJETO (O que já existe)
*O projeto é um monorepo e já tem a base pronta.*
*   `backend/src/`
    *   `config/` (uploadConfig.js)
    *   `controllers/` (adminController, alunoController, aulaController)
    *   `middleware/` (auth.js, verificarAdmin.js)
    *   `models/` (alunoModel, aulaModel, presencasModel, db.js)
    *   `routes/` (adminRoutes, alunosRoutes, aulasRoutes, authRoutes)
*   `db/init.sql` (Script de criação do banco)
*   `mobile/src/`
    *   `screens/` (Telas do app)
    *   `assets/`, `utils/`

## 4. O QUE JÁ FOI CONVERSADO / DECIDIDO (Regras de Negócio)
*   **Autenticação:** O projeto já tem login (Admin e Aluno). Precisamos adicionar o perfil "Professor de Reforço" e vincular o Pai ao Aluno (`guardian_id`).
*   **Tabela de Boletim:** O pai vai enviar 2x no ano (meio e fim). Terá foto do boletim. O sistema deve calcular média e tendência (melhorou/piorou).
*   **Tabela de Reforço:** Professor lança semanalmente a evolução (leitura, matemática, comportamento).
*   **Frequência de Treino:** O `presencasModel` já existe. A regra é: 10 aulas no mês; 1 falta = 90% de presença, 4+ faltas = 50% ou menos.
*   **Ranking:** Tabela de competições (data, campeonato, categoria, colocação, pontos).
*   **Relatórios:** Agregação de dados para gerar PDF final.

## 5. PRÓXIMOS PASSOS (Onde paramos)
1.  **Ajustar o Banco de Dados (`db/init.sql`):** Adicionar as tabelas de Boletim, Reforço e Competições.
2.  **Atualizar `alunoModel.js`:** Adicionar os campos `bolsa_atleta`, `foto`, `escola`, `turma` e `responsavel_id`.
3.  **Ajustar o `middleware/auth.js`:** Para aceitar 3 níveis de acesso.
4.  **Criar os Models/Controllers** de Boletim e Reforço no Backend.
5.  **Organizar a pasta `mobile/src/screens/`** em subpastas: `admin/`, `pai/`, `professor/`.