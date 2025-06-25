const mongoose = require('mongoose');

/**
 * Billing Model — Normal Products Only
 */
const billSchema = new mongoose.Schema({
    customer: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        cardNumber: String
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            quantity: Number,
            billedPrice: Number,
            actualCost: Number
        }
    ],
    totalAmount: Number,
    profit: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
