const repairService = require('../services/repair.service');
const { createRepairValidation, updateRepairValidation, changeStatusValidation } = require('../validators/repair.validator');

exports.createRepair = async (req, res) => {
    try {
        const { error } = createRepairValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.createRepair(req.body, req.user);
        res.status(201).json({ message: "Repair created", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateRepair = async (req, res) => {
    try {
        const { error } = updateRepairValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.updateRepair(req.params.id, req.body, req.user);
        res.json({ message: "Repair updated", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.changeRepairStatus = async (req, res) => {
    try {
        const { error } = changeStatusValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const repair = await repairService.changeRepairStatus(req.params.id, req.body, req.user);
        res.json({ message: "Status changed", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.editStatusHistory = async (req, res) => {
    try {
        const repair = await repairService.editStatusHistory(req.params.id, req.params.statusIndex, req.body, req.user);
        res.json({ message: "Status history updated", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteStatusHistory = async (req, res) => {
    try {
        const repair = await repairService.deleteStatusHistory(req.params.id, req.params.statusIndex, req.user);
        res.json({ message: "Status history deleted", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.editRepairPricesAndIssues = async (req, res) => {
    try {
        const repair = await repairService.editRepairPricesAndIssues(req.params.id, req.body, req.user);
        res.json({ message: "Repair pricing updated", repair });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteRepair = async (req, res) => {
    try {
        await repairService.deleteRepair(req.params.id);
        res.json({ message: "Repair deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listRepairs = async (req, res) => {
    try {
        const repairs = await repairService.listRepairs();
        res.json(repairs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.revenueReport = async (req, res) => {
    try {
        const { from, to } = req.query;
        const report = await repairService.revenueReport(from, to);
        res.json(report);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
