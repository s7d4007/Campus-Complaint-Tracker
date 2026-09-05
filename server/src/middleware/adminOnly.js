const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access only.' });
    }
    next();
};

module.exports = adminOnly;
