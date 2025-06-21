const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Super Admin only
router.post('/', authenticateToken, authorizeRoles('super_admin'), ctrl.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteProduct);
router.post('/topup/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.topUpRechargeProduct);

// All Auth
router.get('/', authenticateToken, ctrl.getAllProducts);
router.get('/search', authenticateToken, ctrl.searchProducts);

module.exports = router;
