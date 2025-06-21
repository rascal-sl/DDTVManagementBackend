/**
 * Auth Routes: Endpoints for registration and login.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Only super_admin can register a new user (e.g., admin)
router.post('/register', authenticateToken, authorizeRoles('super_admin'), authController.registerUser);
//router.post('/register', authController.registerUser); // Temporary for setup

// Login is public
router.post('/login', authController.loginUser);

module.exports = router;
