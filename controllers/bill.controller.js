const billService = require('../services/bill.service');
const { createBillValidation } = require('../validators/bill.validator');
const moment = require('moment-timezone');

exports.createBill = async (req, res) => {
    const { error } = createBillValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const bill = await billService.createBill(req.body, req.user);
        res.status(201).json({ message: "Bill created successfully", bill });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBills = async (req, res) => {
    try {
        const { from, to } = req.query;
        const bills = await billService.getAllBills(req.user, from, to);
        res.json(bills.map(b => ({
            ...b._doc,
            createdAt: moment(b.createdAt).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss'),
            createdByName: b.createdByName
        })));
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch bills', error: err.message });
    }
};

exports.getBillsByCustomerId = async (req, res) => {
    try {
        const bills = await billService.getBillsByCustomerId(req.params.customerId);
        res.json(bills.map(b => ({
            ...b._doc,
            createdAt: moment(b.createdAt).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss'),
            createdByName: b.createdByName
        })));
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch bills', error: err.message });
    }
};

exports.getRevenueReport = async (req, res) => {
    try {
        const { from, to } = req.query;
        const report = await billService.getRevenueReport(from, to);
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: 'Failed to calculate report', error: err.message });
    }
};

exports.getBillById = async (req, res) => {
    try {
        const bill = await billService.getBillById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        const moment = require('moment-timezone');
        res.json({
            ...bill._doc,
            createdAt: moment(bill.createdAt).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss'),
            createdByName: bill.createdByName
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch bill', error: err.message });
    }
};

// Update bill (super admin only)
exports.updateBillById = async (req, res) => {
    try {
        const updated = await billService.updateBillById(req.params.id, req.body, req.user);
        if (!updated) return res.status(404).json({ message: 'Bill not found' });
        res.json({ message: 'Bill updated successfully', bill: updated });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete bill (super admin only)
exports.deleteBillById = async (req, res) => {
    try {
        const deleted = await billService.deleteBillById(req.params.id, req.user);
        if (!deleted) return res.status(404).json({ message: 'Bill not found' });
        res.json({ message: 'Bill deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
