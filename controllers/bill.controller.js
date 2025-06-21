const { createBillValidation } = require('../validators/bill.validator');
const billService = require('../services/bill.service');
const logger = require('../utils/logger');

exports.createBill = async (req, res) => {
    try {
        const { error } = createBillValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const bill = await billService.createBill(req.body, req.user);
        res.status(201).json({ message: 'Bill created successfully', bill });
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: createBill - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getTodaysBills = async (req, res) => {
    try {
        const bills = await billService.getTodaysBills(req.user);
        res.json(bills);
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: getTodaysBills - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.filterBills = async (req, res) => {
    try {
        const bills = await billService.filterBills(req.query);
        res.json(bills);
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: filterBills - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getBillById = async (req, res) => {
    try {
        const bill = await billService.getBillById(req.params.id);
        res.json(bill);
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: getBillById - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.editBill = async (req, res) => {
    try {
        const bill = await billService.editBill(req.params.id, req.body, req.user);
        res.json({ message: 'Bill updated successfully', bill });
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: editBill - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBill = async (req, res) => {
    try {
        await billService.deleteBill(req.params.id, req.user);
        res.json({ message: 'Bill deleted successfully' });
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] ACTION: deleteBill - ERROR: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
