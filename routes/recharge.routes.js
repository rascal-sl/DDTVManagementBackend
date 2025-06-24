const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const ctrl = require('../controllers/recharge.controller');

// Top-up management (super admin)
router.post('/topup', authenticateToken, authorizeRoles('super_admin'), ctrl.addTopup);
router.put('/topup/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.editTopup);
router.delete('/topup/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteTopup);
router.get('/topup', authenticateToken, authorizeRoles('super_admin'), ctrl.listTopups);

// Sale (admin or super_admin)
router.post('/sale', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.sellRecharge);
router.get('/sales', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.listSales);

// Balances (any role)
router.get('/balance', authenticateToken, ctrl.getBalances);

// Revenue/profit reporting (super_admin)
router.get('/revenue', authenticateToken, authorizeRoles('super_admin'), ctrl.revenueReport);

//History
router.get('/sales/customer/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.customerSaleHistory);
router.get('/sales/agent/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.agentSaleHistory);

module.exports = router;
