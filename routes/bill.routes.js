const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const ctrl = require('../controllers/bill.controller');

router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.createBill);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getAllBills);
router.get('/customer/:customerId', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getBillsByCustomerId);
router.get('/report', authenticateToken, authorizeRoles('super_admin'), ctrl.getRevenueReport);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getBillById);
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.updateBillById);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteBillById);

module.exports = router;
