// validators/bill.validator.js
const Joi = require('joi');

const customerSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    nic: Joi.string().required(),
    cardNumber: Joi.string().required(),
    whatsappNumber: Joi.string().required()
});

const agentSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    nic: Joi.string().required(),
    whatsappNumber: Joi.string().required()
});

const productSchema = Joi.object({
    productId: Joi.string().required(),
    name: Joi.string().required(),
    productType: Joi.string().valid('normal', 'recharge').required(),
    quantity: Joi.number().integer().min(1).required(),
    billedPrice: Joi.number().min(0).required(),
    actualCost: Joi.number().min(0).required()
});

exports.createBillValidation = Joi.object({
    customer: customerSchema.optional(),
    agent: agentSchema.optional(),
    products: Joi.array().items(productSchema).min(1).required(),
    totalAmount: Joi.number().min(1).required()
}).xor('customer', 'agent'); // Either customer or agent, not both

