const mongoose = require('mongoose');

/**
 * Recharge Top-up: Each time the company buys recharge credit from a provider
 * Only Super Admin can add/edit/delete these records
 */
const rechargeTopupSchema = new mongoose.Schema({
    rechargeType: { type: String, required: true, enum: ['Dialog', 'DDTV', 'Mobitel', 'Hutch', 'Airtel'] },
    topUpValue: { type: Number, required: true }, // Face value (what can be sold), e.g. 50000
    topUpCost: { type: Number, required: true },  // What was paid, e.g. 45000
    topUpDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RechargeTopup', rechargeTopupSchema);
