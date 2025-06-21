const service = require('../services/expenseCategory.service');
const { createCategoryValidation } = require('../validators/expenseCategory.validator');
const logger = require('../utils/logger');

exports.createCategory = async (req, res) => {
    try {
        const { error } = createCategoryValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const cat = await service.createCategory(req.body, req.user);
        res.status(201).json(cat);
    } catch (err) {
        logger.error(`[createCategory] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const cats = await service.getCategories();
        res.json(cats);
    } catch (err) {
        logger.error(`[getCategories] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { error } = createCategoryValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const cat = await service.updateCategory(req.params.id, req.body, req.user);
        res.json(cat);
    } catch (err) {
        logger.error(`[updateCategory] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await service.deleteCategory(req.params.id, req.user);
        res.json({ message: "Category deleted" });
    } catch (err) {
        logger.error(`[deleteCategory] ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};
