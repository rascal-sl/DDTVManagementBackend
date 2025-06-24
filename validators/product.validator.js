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

});

const updateProductValidation = Joi.object({
    name: Joi.string(),
    quantity: Joi.number().integer().min(0),
    buyingPrice: Joi.number().min(0),
    sellingPrice: Joi.number().min(0)
});


module.exports = { createProductValidation, updateProductValidation };
