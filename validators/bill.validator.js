const Joi = require('joi');

exports.createBillValidation = Joi.object({
    customerId: Joi.string().required(),
    products: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
            billedPrice: Joi.number().positive().required()
        })
    ).min(1).required()
});
