/**
 * Admin Management Controller
 * Only super_admin can access these endpoints
 */
const User = require('../models/user.model');
const { registerSchema } = require('../validators/auth.validator');
const logger = require('../utils/logger');
const { deleteAdminById } = require('../services/admin.service');
const { adminIdParamSchema } = require('../validators/admin.validator');

// Create new admin or super_admin
exports.createAdmin = async (req, res) => {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await User.create(req.body);
        logger.userAction('Admin created', {
            email: user.email,
            role: user.role,
            createdBy: req.user.email,
            status: 'success',
            timestamp: new Date().toISOString()
        });
        res.status(201).json({
            message: 'Admin created successfully',
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
        logger.userAction('Admin creation failed', {
            email: req.body.email,
            role: req.body.role,
            createdBy: req.user.email,
            status: 'failure',
            timestamp: new Date().toISOString()
        });
        res.status(400).json({ message: err.message });
    }
};

// List all admins and super_admins
exports.listAdmins = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['admin', 'super_admin'] } }, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch admins' });
    }
};

// Edit admin details (super_admin only)
exports.editAdmin = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, role, status } = req.body;

    try {
        const user = await User.findById(id);
        if (!user || !['admin', 'super_admin'].includes(user.role))
            return res.status(404).json({ message: 'Admin not found' });

        // Update allowed fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.role = role || user.role;
        user.status = status || user.status;

        await user.save();

        logger.userAction('Admin edited', {
            email: user.email,
            role: user.role,
            editedBy: req.user.email,
            status: 'success',
            timestamp: new Date().toISOString()
        });

        res.json({
            message: 'Admin updated',
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
        logger.userAction('Admin edit failed', {
            adminId: id,
            editedBy: req.user.email,
            status: 'failure',
            timestamp: new Date().toISOString()
        });
        res.status(400).json({ message: err.message });
    }
};


/**
 * Delete an admin or super_admin (super_admin only)
 * - Validates ID param
 * - Prevents deleting self
 * - Only deletes users with role admin or super_admin
 * - Logs all actions
 */
exports.deleteAdmin = async (req, res) => {
    //Validate ID param
    const { error } = adminIdParamSchema.validate(req.params);
    if (error) {
        logger.userAction('Admin delete validation failed', {
            adminId: req.params.id,
            deletedBy: req.user.email,
            status: 'failure',
            error: error.details[0].message,
            timestamp: new Date().toISOString()
        });
        return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;

    try {
        const user = await deleteAdminById(id, req.user.id);

        logger.userAction('Admin deleted', {
            email: user.email,
            role: user.role,
            deletedBy: req.user.email,
            status: 'success',
            timestamp: new Date().toISOString()
        });

        res.json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        logger.userAction('Admin delete failed', {
            adminId: id,
            deletedBy: req.user.email,
            status: 'failure',
            error: err.message,
            timestamp: new Date().toISOString()
        });

        const status = err.statusCode || 500;
        res.status(status).json({ message: err.message });
    }
};