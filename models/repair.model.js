const mongoose = require('mongoose');

/**
 * Tracks full repair flow for customer decoder/setup box repairs.
 */
const repairSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    repairProduct: { type: String, default: 'Setup Box' },
    issues: [{ type: String, enum: ['Power Issue', 'Video Issue', 'Other'] }],
    companyPrice: { type: Number, required: true },
    ddtvPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    status: {
        type: String,
        enum: [
            'Received from Customer',
            'Sent to Company',
            'Returned from Company',
            'Customer Collected'
        ],
        default: 'Received from Customer'
    },

    receivedFromCustomerAt: Date,
    sentToCompanyAt: Date,
    returnedFromCompanyAt: Date,
    returnedToCustomerAt: Date,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repair', repairSchema);
