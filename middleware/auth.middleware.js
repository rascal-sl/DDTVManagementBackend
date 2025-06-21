/**
 * JWT Authentication Middleware: Verifies token and appends full user info to req.user.
 */
const { verifyToken } = require('../utils/jwt');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Authorization token required' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token); // should include { id, role }
        // Fetch full user profile (includes names)
        const user = await User.findById(decoded.id).lean();
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            status: user.status
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };
