const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const alunoRoutes = require('./src/routes/alunoRoutes');
const aulaRoutes = require('./src/routes/aulaRoutes');
const boletimRoutes = require('./src/routes/boletimRoutes');
const competicaoRoutes = require('./src/routes/competicaoRoutes');
const reforcoRoutes = require('./src/routes/reforcoRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/alunos', alunoRoutes);
app.use('/aulas', aulaRoutes);
app.use('/boletins', boletimRoutes);
app.use('/competicoes', competicaoRoutes);
app.use('/reforcos', reforcoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});