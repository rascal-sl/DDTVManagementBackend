const mongoose = require('mongoose');

/**
 * Office expense: logs what, who, when, how much, and under which category.
 */
const expenseSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    expenseDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
