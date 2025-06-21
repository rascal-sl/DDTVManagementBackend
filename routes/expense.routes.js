const router = require('express').Router();
const ctrl = require('../controllers/expense.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.createExpense);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getExpenses);
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.updateExpense);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteExpense);

module.exports = router;
