const Repair = require('../models/repair.model');
const Customer = require('../models/customer.model');
const { getSriLankaTime } = require('../utils/timezone');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const ISSUE_PRICING = {
    'Power Issue':   { company: 1300, ddtv: 1600 },
    'Video Issue':   { company: 1300, ddtv: 1600 },
    'Other':         { company: 200, ddtv: 400 }
};

exports.createRepair = async (data, user) => {
    // 1. Validate customer
    if (!mongoose.Types.ObjectId.isValid(data.customerId)) throw new Error('Invalid customer ID');
    const customer = await Customer.findById(data.customerId);
    if (!customer) throw new Error('Customer not found');

    // 2. Price calculation
    let companyTotal = 0, ddtvTotal = 0;
    for (const issue of data.issues) {
        companyTotal += ISSUE_PRICING[issue].company;
        ddtvTotal += ISSUE_PRICING[issue].ddtv;
    }
    let discount = data.discount || 0;
    if (discount < 0) throw new Error('Discount cannot be negative');
    const finalAmount = ddtvTotal - discount;

    // 3. Create repair
    const repair = await Repair.create({
        customerId: customer._id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        phoneNumber: customer.phoneNumber,
        nicNumber: customer.nicNumber,
        issues: data.issues,
        companyPrice: companyTotal,
        ddtvPrice: ddtvTotal,
        discount,
        finalAmount,
        receivedFromCustomerAt: getSriLankaTime(),
        status: 'Received from Customer',
        createdBy: user.id,
        createdByName: user.firstName,
        updatedBy: user.id,
        updatedByName: user.firstName
    });

    logger.userAction(`[${new Date().toISOString()}] ACTION: createRepair by ${user.firstName} (ID:${user.id}) - SUCCESS - Repair: ${repair.customerName} (${repair.nicNumber})`);
    return repair;
};

exports.updateRepair = async (id, data, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');

    // Only super admin can update price fields
    if (('companyPrice' in data || 'ddtvPrice' in data || 'finalAmount' in data) && user.role !== 'super_admin') {
        throw new Error('Only Super Admin can modify price fields.');
    }
    if (data.issues) repair.issues = data.issues;
    if ('discount' in data && data.discount >= 0) {
        repair.discount = data.discount;
        repair.finalAmount = repair.ddtvPrice - data.discount;
    }
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = getSriLankaTime();
    await repair.save();
    logger.userAction(`[${new Date().toISOString()}] ACTION: updateRepair by ${user.firstName} (ID:${user.id}) - SUCCESS - RepairID: ${id}`);
    return repair;
};

exports.changeRepairStatus = async (id, status, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');
    // Prevent skipping stages
    const statusOrder = [
        'Received from Customer',
        'Sent to Company',
        'Returned from Company',
        'Customer Collected'
    ];
    const currentIndex = statusOrder.indexOf(repair.status);
    const newIndex = statusOrder.indexOf(status);
    if (newIndex !== currentIndex + 1 && !(repair.status === status)) {
        throw new Error('Invalid status transition');
    }
    // Set time
    if (status === 'Sent to Company') repair.sentToCompanyAt = getSriLankaTime();
    if (status === 'Returned from Company') repair.returnedFromCompanyAt = getSriLankaTime();
    if (status === 'Customer Collected') repair.returnedToCustomerAt = getSriLankaTime();
    repair.status = status;
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = getSriLankaTime();
    await repair.save();
    logger.userAction(`[${new Date().toISOString()}] ACTION: changeRepairStatus by ${user.firstName} (ID:${user.id}) - STATUS: ${status} - RepairID: ${id}`);
    return repair;
};

exports.getRepairs = async (filter = {}) => {
    // Supports filtering by customer, NIC, phone
    const q = {};
    if (filter.customerName) q.customerName = { $regex: filter.customerName, $options: 'i' };
    if (filter.nicNumber) q.nicNumber = filter.nicNumber;
    if (filter.phoneNumber) q.phoneNumber = filter.phoneNumber;
    return Repair.find(q).sort({ createdAt: -1 });
};

exports.getRepairById = async id => {
    return Repair.findById(id);
};

exports.deleteRepair = async (id, user) => {
    const repair = await Repair.findByIdAndDelete(id);
    if (!repair) throw new Error('Repair not found');
    logger.userAction(`[${new Date().toISOString()}] ACTION: deleteRepair by ${user.firstName} (ID:${user.id}) - RepairID: ${id}`);
    return repair;
};
