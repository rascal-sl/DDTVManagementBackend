/**
 * Customer Schema for DD TV Management System.
 * Tracks audit fields (who created/updated, timestamps).
 */
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
            firstName: { type: String, required: true, trim: true },
            lastName: { type: String, required: true, trim: true },
            address: { type: String, required: true },
            phoneNumber: { type: String, required: true, unique: true },
            whatsappNumber: { type: String, required: true },
            nicNumber: { type: String, required: true, unique: true },
            cardNumber: { type: String, required: true, unique: true },
            email: { type: String, trim: true, match: /^\S+@\S+\.\S+$/ },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            createdByName: { type: String, required: true },
            updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            updatedByName: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
