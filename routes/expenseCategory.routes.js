const router = require('express').Router();
const ctrl = require('../controllers/expenseCategory.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticateToken, authorizeRoles('super_admin'), ctrl.createCategory);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getCategories);
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteCategory);

module.exports = router;
