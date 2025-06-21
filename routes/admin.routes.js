/**
 * Admin Management Routes
 * Only super_admin can access these endpoints
 * Delete an admin or super_admin (super_admin only)
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Create new admin/super_admin
router.post(
    '/create',
    authenticateToken,
    authorizeRoles('super_admin'),
    adminController.createAdmin
);

// List all admins/super_admins
router.get(
    '/',
    authenticateToken,
    authorizeRoles('super_admin'),
    adminController.listAdmins
);

// Edit admin/super_admin
router.put(
    '/edit/:id',
    authenticateToken,
    authorizeRoles('super_admin'),
    adminController.editAdmin
);

// Delete admin/super_admin by ID (super_admin only)
router.delete(
    '/delete/:id',
    authenticateToken,
    authorizeRoles('super_admin'),
    adminController.deleteAdmin
);

module.exports = router;
