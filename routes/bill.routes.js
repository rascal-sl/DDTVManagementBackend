const router = require('express').Router();
const {
    createBill,
    getTodaysBills,
    filterBills,
    getBillById,
    editBill,
    deleteBill
} = require('../controllers/bill.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Add a bill (admin/super admin)
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), createBill);

// Admin: View today's bills
router.get('/today', authenticateToken, authorizeRoles('admin', 'super_admin'), getTodaysBills);

// Super admin: Filter bills
router.get('/filter', authenticateToken, authorizeRoles('super_admin'), filterBills);

// Get bill by ID (all authenticated)
router.get('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), getBillById);

// Edit bill (super admin only)
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), editBill);

// Delete bill (super admin only)
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), deleteBill);

module.exports = router;
