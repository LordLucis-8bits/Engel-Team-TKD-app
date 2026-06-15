const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Import routes
const alunosRoutes = require('./src/routes/alunosRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const aulasRoutes = require('./src/routes/aulasRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.get('/', (req, res) => {
  res.send('API Engel Team TKD rodando com sucesso!');
});

// Use routes
app.use('/alunos', alunosRoutes);
app.use('/admin', adminRoutes);
app.use('/aulas', aulasRoutes);
app.use('/auth', authRoutes);


// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});