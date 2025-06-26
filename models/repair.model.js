const mongoose = require('mongoose');
const statusHistorySchema = new mongoose.Schema({
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,
    dateEntered: Date,
    dateManual: Date,
    note: String,
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: Date
}, { _id: false });

const repairSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: String,
    phoneNumber: String,
    nicNumber: String,
    repairProduct: { type: String, default: "Setup Box" },
    issues: [{
        issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairIssue' },
        name: String,
        actualCost: Number,
        customerPrice: Number
    }],
    totalActualCost: Number,
    totalCustomerPrice: Number,
    discount: { type: Number, default: 0 },
    finalAmount: Number,
    profit: Number,
    status: { type: String, required: true },
    statusHistory: [statusHistorySchema],
    expectedReturnDate: Date,
    receivedFromCustomerAt: Date,
    sentToCompanyAt: Date,
    returnedFromCompanyAt: Date,
    returnedToCustomerAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,
    createdAt: Date,
    updatedAt: Date
});
module.exports = mongoose.model('Repair', repairSchema);
