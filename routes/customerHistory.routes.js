const router = require('express').Router();
const ctrl = require('../controllers/customerHistory.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Super admin only!
router.get('/:customerId/bill-history/normal', authenticateToken, authorizeRoles('super_admin'), ctrl.getNormalProductBills);
router.get('/:customerId/bill-history/recharge', authenticateToken, authorizeRoles('super_admin'), ctrl.getRechargeBills);
router.get('/:customerId/repairs', authenticateToken, authorizeRoles('super_admin'), ctrl.getRepairs);

module.exports = router;
