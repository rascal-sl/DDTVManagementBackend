const Joi = require('joi');

exports.createRepairValidation = Joi.object({
    customerId: Joi.string().required(),
    issues: Joi.array().items(Joi.string().required()).min(1).required(),
    discount: Joi.number().min(0).optional(),
    expectedReturnDate: Joi.date().required()
});

exports.updateRepairValidation = Joi.object({
    issues: Joi.array().items(Joi.string().required()).min(1).optional(),
    discount: Joi.number().min(0).optional(),
    expectedReturnDate: Joi.date().optional()
});

exports.changeStatusValidation = Joi.object({
    status: Joi.string().required(),
    dateManual: Joi.date().optional(),
    note: Joi.string().optional()
});
