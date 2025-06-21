const Joi = require('joi');

exports.createExpenseValidation = Joi.object({
    categoryId: Joi.string().required().messages({
        'string.empty': 'Category is required.'
    }),
    amount: Joi.number().positive().required().messages({
        'number.base': 'Amount must be a number.',
        'number.positive': 'Amount must be a positive number.',
        'any.required': 'Amount is required.'
    }),
    description: Joi.string().allow(''),
    expenseDate: Joi.date().optional()
});
