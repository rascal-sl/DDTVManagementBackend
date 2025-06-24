const rechargeService = require('../services/recharge.service');
const { topupValidation, saleValidation } = require('../validators/recharge.validator');

exports.addTopup = async (req, res) => {
    const { error } = topupValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const topup = await rechargeService.createTopup(req.body, req.user);
        res.status(201).json({ message: "Top-up added", topup });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.editTopup = async (req, res) => {
    const { error } = topupValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const topup = await rechargeService.updateTopup(req.params.id, req.body, req.user);
        if (!topup) return res.status(404).json({ message: "Top-up not found" });
        res.json({ message: "Top-up updated", topup });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteTopup = async (req, res) => {
    try {
        const topup = await rechargeService.deleteTopup(req.params.id);
        if (!topup) return res.status(404).json({ message: "Top-up not found" });
        res.json({ message: "Top-up deleted" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.listTopups = async (req, res) => {
    const topups = await rechargeService.listTopups();
    res.json(topups);
};

exports.getBalances = async (req, res) => {
    const balances = await rechargeService.getBalances();
    res.json(balances);
};

exports.sellRecharge = async (req, res) => {
    const { error } = saleValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const sale = await rechargeService.sellRecharge(req.body, req.user);
        res.status(201).json({ message: "Recharge sold", sale });
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.listSales = async (req, res) => {
    const sales = await rechargeService.listSales();
    res.json(sales);
};

// Revenue report (super admin)
exports.revenueReport = async (req, res) => {
    const { rechargeType, from, to } = req.query;
    let filter = {};
    if (rechargeType) filter.rechargeType = rechargeType;
    if (from || to) filter.saleDate = {};
    if (from) filter.saleDate.$gte = new Date(from);
    if (to) filter.saleDate.$lte = new Date(to);
    const report = await rechargeService.getRevenueAndProfit(filter);
    res.json(report);
};

// Fetch history
exports.customerSaleHistory = async (req, res) => {
    try {
        const sales = await rechargeService.listSales({ soldToType: 'customer', soldToId: req.params.id });
        res.json(sales);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.agentSaleHistory = async (req, res) => {
    try {
        const sales = await rechargeService.listSales({ soldToType: 'agent', soldToId: req.params.id });
        res.json(sales);
    } catch (e) { res.status(500).json({ message: e.message }); }
};
