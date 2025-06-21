const customerHistoryService = require('../services/customerHistory.service');
const Customer = require('../models/customer.model');
const logger = require('../utils/logger');
const { formatSriLankaTime } = require('../utils/timezone');

// Validate customer existence utility
const checkCustomer = async (customerId) => {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error('Customer not found');
    return customer;
};

// GET /api/customers/:customerId/bill-history/normal
exports.getNormalProductBills = async (req, res) => {
    try {
        await checkCustomer(req.params.customerId);
        const bills = await customerHistoryService.getNormalProductBills(req.params.customerId);
        logger.userAction(`[${new Date().toISOString()}] ACTION: ViewNormalBillHistory - CustomerID: ${req.params.customerId} by ${req.user.firstName} (Super Admin)`);
        res.json(bills);
    } catch (err) {
        logger.error(`[getNormalProductBills] ${err.message}`);
        res.status(404).json({ message: err.message });
    }
};

// GET /api/customers/:customerId/bill-history/recharge
exports.getRechargeBills = async (req, res) => {
    try {
        await checkCustomer(req.params.customerId);
        const bills = await customerHistoryService.getRechargeBills(req.params.customerId);
        logger.userAction(`[${new Date().toISOString()}] ACTION: ViewRechargeHistory - CustomerID: ${req.params.customerId} by ${req.user.firstName} (Super Admin)`);
        res.json(bills);
    } catch (err) {
        logger.error(`[getRechargeBills] ${err.message}`);
        res.status(404).json({ message: err.message });
    }
};

// GET /api/customers/:customerId/repairs
exports.getRepairs = async (req, res) => {
    try {
        await checkCustomer(req.params.customerId);
        const repairs = await customerHistoryService.getRepairs(req.params.customerId);
        logger.userAction(`[${new Date().toISOString()}] ACTION: ViewRepairHistory - CustomerID: ${req.params.customerId} by ${req.user.firstName} (Super Admin)`);
        res.json(repairs);
    } catch (err) {
        logger.error(`[getRepairs] ${err.message}`);
        res.status(404).json({ message: err.message });
    }
};
