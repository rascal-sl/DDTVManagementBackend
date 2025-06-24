const Joi = require('joi');

exports.topupValidation = Joi.object({
    rechargeType: Joi.string().valid('Dialog', 'DDTV', 'Mobitel', 'Hutch', 'Airtel').required(),
    topUpValue: Joi.number().positive().required(),
    topUpCost: Joi.number().positive().required(),
    topUpDate: Joi.date().required()
});

exports.saleValidation = Joi.object({
    rechargeType: Joi.string().valid('Dialog', 'DDTV', 'Mobitel', 'Hutch', 'Airtel').required(),
    soldValue: Joi.number().positive().required(),
    soldPrice: Joi.number().positive().required(),
    soldToType: Joi.string().valid('customer', 'agent').required(),
    soldToId: Joi.string().required()
});
