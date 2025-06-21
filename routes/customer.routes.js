const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Create and Get all: Admin & Super Admin
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), customerController.createCustomer);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), customerController.getAllCustomers);

// Search: any authenticated user (no role restriction)
router.get('/search', authenticateToken, customerController.searchCustomers);

// Update/Delete: Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), customerController.updateCustomer);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), customerController.deleteCustomer);

module.exports = router;
