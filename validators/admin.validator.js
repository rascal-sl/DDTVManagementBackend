/**
 * Admin Validator: Validates request params for admin operations.
 */
const Joi = require('joi');

const adminIdParamSchema = Joi.object({
    id: Joi.string().length(24).hex().required().label('Admin ID')
});

module.exports = { adminIdParamSchema };
