const router = require('express').Router();
const ctrl = require('../controllers/repair.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.createRepair);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getRepairs);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.getRepairById);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.updateRepair);
router.patch('/status/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.changeRepairStatus);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.deleteRepair);

module.exports = router;
