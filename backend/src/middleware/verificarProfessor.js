const verificarProfessor = (req, res, next) => {
    if (req.user?.role !== 'professor' && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas professores.' });
    }
    next();
};

module.exports = verificarProfessor;