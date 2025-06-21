const router = require('express').Router();
const {
    createAgent, getAllAgents, searchAgents,
    updateAgent, deleteAgent
} = require('../controllers/agent.controller');

const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), createAgent);
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), getAllAgents);
router.get('/search', authenticateToken, searchAgents); // all users
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), updateAgent);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), deleteAgent);

module.exports = router;
