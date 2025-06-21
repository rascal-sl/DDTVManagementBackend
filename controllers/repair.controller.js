const repairService = require('../services/repair.service');
const { createRepairValidation, updateRepairValidation, statusChangeValidation } = require('../validators/repair.validator');
const logger = require('../utils/logger');
const { formatSriLankaTime } = require('../utils/timezone');

exports.createRepair = async (req, res) => {
    try {
        const { error } = createRepairValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.createRepair(req.body, req.user);
        res.status(201).json({ message: 'Repair created successfully', repair });
    } catch (err) {
        logger.error(`[createRepair] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.updateRepair = async (req, res) => {
    try {
        const { error } = updateRepairValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.updateRepair(req.params.id, req.body, req.user);
        res.json({ message: 'Repair updated successfully', repair });
    } catch (err) {
        logger.error(`[updateRepair] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.changeRepairStatus = async (req, res) => {
    try {
        const { error } = statusChangeValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.changeRepairStatus(req.params.id, req.body.status, req.user);
        // On "Customer Collected" status, return WhatsApp payload for frontend
        let whatsappMsg = undefined;
        if (repair.status === 'Customer Collected') {
            whatsappMsg = `📦 *DD TV Repair Ready for Collection!*\n👤 Name: ${repair.customerName}\n🛠️ Issue(s): ${repair.issues.join(', ')}\n💰 Amount: Rs. ${repair.finalAmount}\n📆 Ready Date: ${formatSriLankaTime(repair.returnedToCustomerAt)}\n📍 Location: DD TV Office`;
        }
        res.json({ message: 'Status updated', repair, whatsappMsg });
    } catch (err) {
        logger.error(`[changeRepairStatus] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getRepairs = async (req, res) => {
    try {
        const repairs = await repairService.getRepairs(req.query);
        res.json(repairs);
    } catch (err) {
        logger.error(`[getRepairs] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getRepairById = async (req, res) => {
    try {
        const repair = await repairService.getRepairById(req.params.id);
        if (!repair) return res.status(404).json({ message: 'Repair not found' });
        res.json(repair);
    } catch (err) {
        logger.error(`[getRepairById] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRepair = async (req, res) => {
    try {
        await repairService.deleteRepair(req.params.id, req.user);
        res.json({ message: 'Repair deleted' });
    } catch (err) {
        logger.error(`[deleteRepair] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
