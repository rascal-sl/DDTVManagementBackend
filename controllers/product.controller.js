const { createProductValidation, updateProductValidation, topUpRechargeValidation } = require('../validators/product.validator');
const service = require('../services/product.service');
const logger = require('../utils/logger');

// Only Super Admin can create, edit, delete, topup
exports.createProduct = async (req, res) => {
    try {
        const { error } = createProductValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const user = req.user;
        const prod = await service.createProduct({
            ...req.body,
            createdBy: user.id,
            createdByName: user.firstName,
            updatedBy: user.id,
            updatedByName: user.firstName
        });
        logger.userAction(`[${new Date().toISOString()}] ACTION: createProduct by ${user.firstName} - SUCCESS - Product: ${prod.name}`);
        res.status(201).json({ message: 'Product created successfully', product: prod });
    } catch (err) {
        logger.error(err.message); res.status(400).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { error } = updateProductValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const prod = await service.updateProduct(req.params.id, {
            ...req.body,
            updatedBy: req.user.id,
            updatedByName: req.user.firstName
        });
        res.json({ message: 'Product updated', product: prod });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        await service.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllProducts = async (req, res) => {
    res.json(await service.getAllProducts());
};

exports.searchProducts = async (req, res) => {
    const q = req.query.q || ''; const type = req.query.type;
    res.json(await service.searchProducts(q, type));
};

exports.topUpRechargeProduct = async (req, res) => {
    try {
        const { error } = topUpRechargeValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const prod = await service.topUpRechargeProduct(
            req.params.id,
            req.body.topUpValue,
            req.body.topUpCost,
            req.user.id,
            req.user.firstName
        );
        res.json({ message: 'Recharge balance topped up', product: prod });
    } catch (err) { res.status(400).json({ message: err.message }); }
};
