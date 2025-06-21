const mongoose = require('mongoose');

/**
 * Bill Schema: Stores billing details for both agents and customers.
 */
const billSchema = new mongoose.Schema({
    customer: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        name: String,
        phone: String,
        nic: String,
        cardNumber: String,
        whatsappNumber: String
    },
    agent: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
        name: String,
        phone: String,
        nic: String,
        whatsappNumber: String
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            productType: String, // "normal" or "recharge"
            quantity: Number,
            billedPrice: Number,
            actualCost: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    profit: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
