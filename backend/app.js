const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const aulaRoutes = require('./routes/aulaRoutes');
const boletimRoutes = require('./routes/boletimRoutes');
const competicaoRoutes = require('./routes/competicaoRoutes');
const reforcoRoutes = require('./routes/reforcoRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/alunos', alunoRoutes);
app.use('/aulas', aulaRoutes);
app.use('/boletins', boletimRoutes);
app.use('/competicoes', competicaoRoutes);
app.use('/reforcos', reforcoRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));