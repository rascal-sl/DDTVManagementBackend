const Joi = require('joi');

exports.createRepairValidation = Joi.object({
    customerId: Joi.string().required(),
    issues: Joi.array().items(Joi.string().valid('Power Issue', 'Video Issue', 'Other')).min(1).required(),
    discount: Joi.number().min(0).optional()
});

exports.updateRepairValidation = Joi.object({
    issues: Joi.array().items(Joi.string().valid('Power Issue', 'Video Issue', 'Other')).min(1).optional(),
    discount: Joi.number().min(0).optional(),
    status: Joi.string().valid(
        'Received from Customer',
        'Sent to Company',
        'Returned from Company',
        'Customer Collected'
    ).optional()
});

exports.statusChangeValidation = Joi.object({
    status: Joi.string().valid(
        'Received from Customer',
        'Sent to Company',
        'Returned from Company',
        'Customer Collected'
    ).required()
});
