const repairIssueService = require('../services/repairIssue.service');
exports.createIssue = async (req, res) => {
    try {
        const issue = await repairIssueService.createIssue(req.body, req.user);
        res.status(201).json({ message: "Issue created", issue });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getIssues = async (req, res) => {
    try {
        const issues = await repairIssueService.getIssues();
        res.json(issues);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateIssue = async (req, res) => {
    try {
        const issue = await repairIssueService.updateIssue(req.params.id, req.body, req.user);
        res.json({ message: "Issue updated", issue });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteIssue = async (req, res) => {
    try {
        await repairIssueService.deleteIssue(req.params.id);
        res.json({ message: "Issue deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
