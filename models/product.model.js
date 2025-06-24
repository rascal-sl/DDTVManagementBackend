/**
 * Product Schema for DD TV Management System.
 * Tracks all fields, audit logs, and supports both normal and recharge product types.
 */
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    productType: { type: String, enum: ['normal', 'recharge'], required: true },
    quantity: { type: Number, default: 0 }, // Only for 'normal'
    buyingPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);