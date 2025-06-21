const Joi = require('joi');

exports.createCategoryValidation = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Category name is required.',
        'string.min': 'Category name must be at least 3 characters.'
    })
});
