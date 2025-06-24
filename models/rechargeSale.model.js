const mongoose = require('mongoose');

/**
 * Recharge Sale: Every time a recharge value is sold to a customer or agent.
 * Stores actual sale price, profit, and reference to both buyer and seller.
 */
const rechargeSaleSchema = new mongoose.Schema({
    rechargeType: { type: String, required: true, enum: ['Dialog', 'DDTV', 'Mobitel', 'Hutch', 'Airtel'] },
    soldValue: { type: Number, required: true },     // Value of recharge given (e.g., 1000)
    soldPrice: { type: Number, required: true },     // How much you sold for (e.g., 950)
    unitCost: { type: Number, required: true },      // Auto-calculated per-sale (see below)
    profit: { type: Number, required: true },        // soldPrice - (soldValue * unitCost)
    soldToType: { type: String, required: true, enum: ['customer', 'agent'] },
    soldToId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'soldToType' },
    soldToName: { type: String, required: true },    // Auto-filled from DB for historical reporting
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String },
    saleDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('RechargeSale', rechargeSaleSchema);
