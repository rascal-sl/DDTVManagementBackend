const router = require('express').Router();
const ctrl = require('../controllers/repair.controller');
const statusCtrl = require('../controllers/repairStatus.controller');
const issueCtrl = require('../controllers/repairIssue.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Status Master CRUD
router.post('/statuses', authenticateToken, authorizeRoles('super_admin'), statusCtrl.createStatus);
router.get('/statuses', authenticateToken, authorizeRoles('admin','super_admin'), statusCtrl.getStatuses);
router.put('/statuses/:id', authenticateToken, authorizeRoles('super_admin'), statusCtrl.updateStatus);
router.delete('/statuses/:id', authenticateToken, authorizeRoles('super_admin'), statusCtrl.deleteStatus);

// Issue Master CRUD
router.post('/issues', authenticateToken, authorizeRoles('super_admin'), issueCtrl.createIssue);
router.get('/issues', authenticateToken, authorizeRoles('admin', 'super_admin'), issueCtrl.getIssues);
router.put('/issues/:id', authenticateToken, authorizeRoles('super_admin'), issueCtrl.updateIssue);
router.delete('/issues/:id', authenticateToken, authorizeRoles('super_admin'), issueCtrl.deleteIssue);

// Repair CRUD, status, audit, etc
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.createRepair);
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.updateRepair);
router.patch('/status/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.changeRepairStatus);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteRepair);

router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), ctrl.listRepairs);
router.get('/revenue', authenticateToken, authorizeRoles('super_admin'), ctrl.revenueReport);

router.put('/:id/status/:statusIndex', authenticateToken, authorizeRoles('super_admin'), ctrl.editStatusHistory);
router.delete('/:id/status/:statusIndex', authenticateToken, authorizeRoles('super_admin'), ctrl.deleteStatusHistory);
router.put('/:id/edit-pricing', authenticateToken, authorizeRoles('super_admin'), ctrl.editRepairPricesAndIssues);

module.exports = router;
