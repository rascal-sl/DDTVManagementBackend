const service = require('../services/expense.service');
const { createExpenseValidation } = require('../validators/expense.validator');
const logger = require('../utils/logger');

exports.createExpense = async (req, res) => {
    try {
        const { error } = createExpenseValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const exp = await service.createExpense(req.body, req.user);
        res.status(201).json(exp);
    } catch (err) {
        logger.error(`[createExpense] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const exps = await service.getExpenses(req.query);
        res.json(exps);
    } catch (err) {
        logger.error(`[getExpenses] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { error } = createExpenseValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const exp = await service.updateExpense(req.params.id, req.body, req.user);
        res.json(exp);
    } catch (err) {
        logger.error(`[updateExpense] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await service.deleteExpense(req.params.id, req.user);
        res.json({ message: "Expense deleted" });
    } catch (err) {
        logger.error(`[deleteExpense] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
