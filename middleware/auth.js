const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Authorization Middleware
const authorizeRole = (roles) => (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
        return res.status(403).json({ message: 'Access forbidden: Insufficient privileges' });
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeRole
};
