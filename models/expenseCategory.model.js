const mongoose = require('mongoose');

/**
 * Office expense category: centralized, only Super Admin can CRUD.
 */
const expenseCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);
