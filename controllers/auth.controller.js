/**
 * Auth Controller: Handles registration and login logic, returns JWT on success.
 */
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const authService = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

exports.registerUser = async (req, res) => {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await authService.createUser(req.body);
        logger.userAction('User registered', {
            email: user.email,
            role: user.role,
            status: 'success',
            timestamp: new Date().toISOString()
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (err) {
        logger.userAction('Register attempt failed', {
            email: req.body.email,
            role: req.body.role,
            status: 'failure',
            timestamp: new Date().toISOString()
        });
        res.status(400).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await authService.getUserByEmail(req.body.email);
        if (!user || user.status !== 'active')
            throw new Error('Invalid credentials or inactive user');

        const validPassword = await user.comparePassword(req.body.password);
        if (!validPassword) throw new Error('Invalid credentials');

        // Token payload contains id, email, role
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        logger.userAction('User login', {
            email: user.email,
            role: user.role,
            status: 'success',
            timestamp: new Date().toISOString()
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (err) {
        logger.userAction('Login attempt failed', {
            email: req.body.email,
            role: '',
            status: 'failure',
            timestamp: new Date().toISOString()
        });
        res.status(401).json({ message: err.message });
    }
};
