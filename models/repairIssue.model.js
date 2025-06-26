const mongoose = require('mongoose');
const repairIssueSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    actualCost: { type: Number, required: true },
    customerPrice: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,
}, { timestamps: true });
module.exports = mongoose.model('RepairIssue', repairIssueSchema);
