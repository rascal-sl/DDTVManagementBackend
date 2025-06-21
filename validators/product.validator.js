/**
 * Joi validation for Product CRUD and Top-up operations.
 */
const Joi = require('joi');

const createProductValidation = Joi.object({
    name: Joi.string().required(),
    productType: Joi.string().valid('normal', 'recharge').required(),
    quantity: Joi.when('productType', { is: 'normal', then: Joi.number().integer().min(0).required(), otherwise: Joi.forbidden() }),
    buyingPrice: Joi.number().min(0).required(),
    sellingPrice: Joi.number().min(0).required(),
    rechargeBalance: Joi.when('productType', { is: 'recharge', then: Joi.number().integer().min(0).required(), otherwise: Joi.forbidden() })
});

const updateProductValidation = Joi.object({
    name: Joi.string(),
    quantity: Joi.number().integer().min(0),
    buyingPrice: Joi.number().min(0),
    sellingPrice: Joi.number().min(0),
    rechargeBalance: Joi.number().integer().min(0)
});

const topUpRechargeValidation = Joi.object({
    topUpValue: Joi.number().integer().min(1).required(),
    topUpCost: Joi.number().min(0).required(),
    description: Joi.string().allow('', null)
});

module.exports = { createProductValidation, updateProductValidation, topUpRechargeValidation };
