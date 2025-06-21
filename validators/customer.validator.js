/**
 * Joi validation for Customer creation/updating.
 */
const Joi = require('joi');

const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;
const phonePattern = /^(0\d{9})$/;

const createCustomer = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().pattern(phonePattern).required().messages({
        "string.pattern.base": "Phone number must be Sri Lankan (e.g., 0771234567)."
    }),
    whatsappNumber: Joi.string().pattern(phonePattern).required().messages({
        "string.pattern.base": "WhatsApp number must be Sri Lankan (e.g., 0771234567)."
    }),
    nicNumber: Joi.string().pattern(nicPattern).required().messages({
        "string.pattern.base": "NIC must be 9 digits+letter or 12 digits."
    }),
    cardNumber: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).optional().allow('', null)
});

const updateCustomer = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: Joi.string(),
    phoneNumber: Joi.string().pattern(phonePattern).messages({
        "string.pattern.base": "Phone number must be Sri Lankan (e.g., 0771234567)."
    }),
    whatsappNumber: Joi.string().pattern(phonePattern).messages({
        "string.pattern.base": "WhatsApp number must be Sri Lankan (e.g., 0771234567)."
    }),
    nicNumber: Joi.string().pattern(nicPattern).messages({
        "string.pattern.base": "NIC must be 9 digits+letter or 12 digits."
    }),
    cardNumber: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }).optional().allow('', null)
}).min(1);

module.exports = { createCustomer, updateCustomer };
