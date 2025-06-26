const repairStatusService = require('../services/repairStatus.service');
exports.createStatus = async (req, res) => {
    try {
        const status = await repairStatusService.createStatus(req.body, req.user);
        res.status(201).json({ message: "Status created", status });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getStatuses = async (req, res) => {
    try {
        const statuses = await repairStatusService.getStatuses();
        res.json(statuses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const status = await repairStatusService.updateStatus(req.params.id, req.body, req.user);
        res.json({ message: "Status updated", status });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteStatus = async (req, res) => {
    try {
        await repairStatusService.deleteStatus(req.params.id);
        res.json({ message: "Status deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
