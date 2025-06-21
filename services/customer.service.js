/**
 * Customer Service – DB logic and validation
 */
const Customer = require('../models/customer.model');
const mongoose = require('mongoose');

const createCustomer = async (data) => {
    // Prevent duplicates
    const exists = await Customer.findOne({
        $or: [
            { nicNumber: data.nicNumber },
            { phoneNumber: data.phoneNumber },
            { cardNumber: data.cardNumber }
        ]
    });
    if (exists) throw new Error('NIC, phone, or card already exists for another customer.');

    // Double-check required audit fields (defensive)
    if (!data.createdBy || !data.createdByName) throw new Error('Audit fields missing');

    // DEBUG: print to verify all fields
    // console.log('Customer to create:', data);

    const customer = new Customer(data);
    await customer.save();
    return customer;
};

const getAllCustomers = async () => {
    return Customer.find({}).select('-__v').lean();
};

const searchCustomers = async (query) => {
    // Searchable fields: name, nic, cardNumber, phoneNumber (partial)
    const filters = [];
    if (query.firstName) filters.push({ firstName: { $regex: query.firstName, $options: 'i' } });
    if (query.lastName) filters.push({ lastName: { $regex: query.lastName, $options: 'i' } });
    if (query.nicNumber) filters.push({ nicNumber: { $regex: query.nicNumber, $options: 'i' } });
    if (query.cardNumber) filters.push({ cardNumber: { $regex: query.cardNumber, $options: 'i' } });
    if (query.phoneNumber) filters.push({ phoneNumber: { $regex: query.phoneNumber, $options: 'i' } });
    return Customer.find(filters.length ? { $or: filters } : {}).select('-__v').lean();
};

const updateCustomer = async (id, data, userId, userName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid customer ID');
    const customer = await Customer.findById(id);
    if (!customer) throw new Error('Customer not found');

    // Check for conflicting NIC/phone/card for others
    if (data.nicNumber || data.phoneNumber || data.cardNumber) {
        const conflict = await Customer.findOne({
            _id: { $ne: id },
            $or: [
                data.nicNumber ? { nicNumber: data.nicNumber } : null,
                data.phoneNumber ? { phoneNumber: data.phoneNumber } : null,
                data.cardNumber ? { cardNumber: data.cardNumber } : null,
            ].filter(Boolean)
        });
        if (conflict) throw new Error('Another customer has this NIC, phone, or card');
    }

    Object.assign(customer, data, { updatedBy: userId, updatedByName: userName });
    await customer.save();
    return customer;
};

const deleteCustomer = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid customer ID');
    const result = await Customer.findByIdAndDelete(id);
    if (!result) throw new Error('Customer not found');
};

module.exports = {
    createCustomer,
    getAllCustomers,
    searchCustomers,
    updateCustomer,
    deleteCustomer
};
