/**
 * Customer Controller – handles auth, role logic, and audit
 */
const customerService = require('../services/customer.service');
const { createCustomer, updateCustomer } = require('../validators/customer.validator');
const logger = require('../utils/logger');

// Helper to get full name for audit
const displayName = user => user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || 'Unknown';

// Create
exports.createCustomer = async (req, res) => {
    try {
        const { error } = createCustomer.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = req.user;
        const customer = await customerService.createCustomer({
            ...req.body,
            createdBy: user.id,
            createdByName: displayName(user),
            updatedBy: user.id,
            updatedByName: displayName(user)
        });

        logger.userAction(`[${new Date().toISOString()}] ACTION: createCustomer by ${displayName(user)} (${user.role}, ID: ${user.id}) - Status: SUCCESS - Customer: ${customer.firstName}, NIC: ${customer.nicNumber}`);
        res.status(201).json({ message: "Customer created successfully.", customer });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: createCustomer by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

// Get all
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: getAllCustomers by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch customers.' });
    }
};

// Search (now: any authenticated user)
exports.searchCustomers = async (req, res) => {
    try {
        const customers = await customerService.searchCustomers(req.query);
        logger.userAction(`[${new Date().toISOString()}] ACTION: searchCustomers by ${displayName(req.user)} (ID: ${req.user.id}) - SUCCESS`);
        res.json(customers);
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: searchCustomers by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - FAILURE - ${err.message}`);
        res.status(500).json({ message: err.message });
    }
};

// Update (Super Admin only)
exports.updateCustomer = async (req, res) => {
    try {
        const { error } = updateCustomer.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = req.user;
        const customer = await customerService.updateCustomer(
            req.params.id,
            req.body,
            user.id,
            displayName(user)
        );
        logger.userAction(`[${new Date().toISOString()}] ACTION: updateCustomer by ${displayName(user)} (${user.role}, ID: ${user.id}) - Status: SUCCESS - Customer: ${customer.firstName}, NIC: ${customer.nicNumber}`);
        res.json({ message: "Customer updated successfully.", customer });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: updateCustomer by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

// Delete (Super Admin only)
exports.deleteCustomer = async (req, res) => {
    try {
        await customerService.deleteCustomer(req.params.id);
        logger.userAction(`[${new Date().toISOString()}] ACTION: deleteCustomer by ${displayName(req.user)} (${req.user.role}, ID: ${req.user.id}) - Status: SUCCESS - Customer ID: ${req.params.id}`);
        res.json({ message: "Customer deleted successfully." });
    } catch (err) {
        logger.userAction(`[${new Date().toISOString()}] ACTION: deleteCustomer by ${req.user ? displayName(req.user) : 'Unknown'} (ID: ${req.user ? req.user.id : '-'}) - Status: FAILURE - Reason: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
