const verificarAdmin = (req, res, next) => {
    if (req.user?.tipo !== 'admin') {   
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores' });
    }

    next();
};

module.exports = verificarAdmin;