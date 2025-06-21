/**
 * Agent Controller: Handles endpoints, role logic, audit logging.
 */
const agentService = require('../services/agent.service');
const { createAgentValidation, updateAgentValidation } = require('../validators/agent.validator');
const logger = require('../utils/logger');

const displayName = user =>
    user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || 'Unknown';

// Create Agent (Admin & Super Admin)
exports.createAgent = async (req, res) => {
    try {
        const { error } = createAgentValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const user = req.user;
        const agent = await agentService.createAgent({
            ...req.body,
            createdBy: user.id,
            createdByName: displayName(user),
            updatedBy: user.id,
            updatedByName: displayName(user)
        });
        logger.userAction(`[${new Date().toISOString()}] ACTION: createAgent by ${user.role === 'super_admin' ? 'Super Admin' : 'Admin'} ${displayName(user)} (ID: ${user.id}) - Agent: ${agent.firstName} - Status: SUCCESS`);
        res.status(201).json({ message: "Agent created successfully.", agent });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: createAgent by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

// Get all Agents (Admin & Super Admin)
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await agentService.getAllAgents();
        res.json(agents);
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: getAllAgents by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch agents.' });
    }
};

// Search Agents (All users)
exports.searchAgents = async (req, res) => {
    try {
        const agents = await agentService.searchAgents(req.query);
        logger.userAction(`[${new Date().toISOString()}] ACTION: searchAgents by ${displayName(req.user)} (ID: ${req.user.id}) - SUCCESS`);
        res.json(agents);
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: searchAgents by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - FAILURE - ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Update Agent (Super Admin only)
exports.updateAgent = async (req, res) => {
    try {
        const { error } = updateAgentValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const user = req.user;
        const agent = await agentService.updateAgent(
            req.params.id,
            req.body,
            user.id,
            displayName(user)
        );
        logger.userAction(`[${new Date().toISOString()}] ACTION: updateAgent by Super Admin ${displayName(user)} (ID: ${user.id}) - Status: SUCCESS - Agent: ${agent.firstName}`);
        res.json({ message: "Agent updated successfully.", agent });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: updateAgent by Super Admin ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

// Delete Agent (Super Admin only)
exports.deleteAgent = async (req, res) => {
    try {
        await agentService.deleteAgent(req.params.id);
        logger.userAction(`[${new Date().toISOString()}] ACTION: deleteAgent by Super Admin ${displayName(req.user)} (ID: ${req.user.id}) - Status: SUCCESS - Agent ID: ${req.params.id}`);
        res.json({ message: "Agent deleted successfully." });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: deleteAgent by Super Admin ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
