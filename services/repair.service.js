const Repair = require('../models/repair.model');
const Customer = require('../models/customer.model');
const RepairIssue = require('../models/repairIssue.model');
const moment = require('moment-timezone');
const toSLTime = (date) => moment(date).tz('Asia/Colombo').toDate();

exports.createRepair = async (data, user) => {
    const customer = await Customer.findById(data.customerId);
    if (!customer) throw new Error('Customer not found');
    const issues = await RepairIssue.find({ _id: { $in: data.issues } });
    if (issues.length !== data.issues.length)
        throw new Error('One or more issues not found');

    const issuesArr = issues.map(issue => ({
        issueId: issue._id,
        name: issue.name,
        actualCost: issue.actualCost,
        customerPrice: issue.customerPrice
    }));
    const totalActualCost = issuesArr.reduce((sum, i) => sum + i.actualCost, 0);
    const totalCustomerPrice = issuesArr.reduce((sum, i) => sum + i.customerPrice, 0);
    const discount = data.discount || 0;
    const finalAmount = totalCustomerPrice - discount;
    const profit = finalAmount - totalActualCost;
    const now = toSLTime(Date.now());

    const repair = await Repair.create({
        customerId: customer._id,
        customerName: customer.firstName + ' ' + customer.lastName,
        phoneNumber: customer.phoneNumber,
        nicNumber: customer.nicNumber,
        issues: issuesArr,
        totalActualCost,
        totalCustomerPrice,
        discount,
        finalAmount,
        profit,
        repairProduct: "Setup Box",
        status: 'Received from Customer',
        statusHistory: [{
            status: 'Received from Customer',
            updatedBy: user.id,
            updatedByName: user.firstName,
            dateEntered: now,
            dateManual: data.expectedReturnDate ? toSLTime(data.expectedReturnDate) : now,
            note: 'Initial handover'
        }],
        expectedReturnDate: data.expectedReturnDate ? toSLTime(data.expectedReturnDate) : undefined,
        receivedFromCustomerAt: now,
        createdBy: user.id,
        createdByName: user.firstName,
        createdAt: now,
        updatedBy: user.id,
        updatedByName: user.firstName,
        updatedAt: now
    });
    return repair;
};

exports.updateRepair = async (id, data, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');
    if (data.issues) {
        const issues = await RepairIssue.find({ _id: { $in: data.issues } });
        if (issues.length !== data.issues.length)
            throw new Error('One or more issues not found');
        const issuesArr = issues.map(issue => ({
            issueId: issue._id,
            name: issue.name,
            actualCost: issue.actualCost,
            customerPrice: issue.customerPrice
        }));
        repair.issues = issuesArr;
        repair.totalActualCost = issuesArr.reduce((sum, i) => sum + i.actualCost, 0);
        repair.totalCustomerPrice = issuesArr.reduce((sum, i) => sum + i.customerPrice, 0);
    }
    if (data.discount !== undefined) {
        repair.discount = data.discount;
        repair.finalAmount = repair.totalCustomerPrice - data.discount;
        repair.profit = repair.finalAmount - repair.totalActualCost;
    }
    if (data.expectedReturnDate) {
        repair.expectedReturnDate = toSLTime(data.expectedReturnDate);
    }
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = toSLTime(Date.now());
    await repair.save();
    return repair;
};

exports.changeRepairStatus = async (id, { status, dateManual, note }, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');
    const now = toSLTime(Date.now());
    repair.status = status;
    repair.statusHistory.push({
        status,
        updatedBy: user.id,
        updatedByName: user.firstName,
        dateEntered: now,
        dateManual: dateManual ? toSLTime(dateManual) : now,
        note: note || ''
    });
    if (status === "Sent to Company") repair.sentToCompanyAt = now;
    if (status === "Returned from Company") repair.returnedFromCompanyAt = now;
    if (status === "Customer Collected") repair.returnedToCustomerAt = now;
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = now;
    await repair.save();
    return repair;
};

exports.editStatusHistory = async (id, statusIndex, data, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');
    if (!repair.statusHistory[statusIndex]) throw new Error('Status entry not found');
    Object.assign(repair.statusHistory[statusIndex], data, {
        updatedBy: user.id,
        updatedByName: user.firstName,
        dateEntered: toSLTime(Date.now())
    });
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = toSLTime(Date.now());
    await repair.save();
    return repair;
};

exports.deleteStatusHistory = async (id, statusIndex, user) => {
    const repair = await Repair.findById(id);
    if (!repair) throw new Error('Repair not found');
    if (!repair.statusHistory[statusIndex]) throw new Error('Status entry not found');
    repair.statusHistory[statusIndex].isDeleted = true;
    repair.statusHistory[statusIndex].deletedBy = user.id;
    repair.statusHistory[statusIndex].deletedAt = toSLTime(Date.now());
    repair.updatedBy = user.id;
    repair.updatedByName = user.firstName;
    repair.updatedAt = toSLTime(Date.now());
    await repair.save();
    return repair;
};

exports.editRepairPricesAndIssues = async (id, data, user) => {
    // For advanced: let super admin update pricing after creation, if needed
    return await exports.updateRepair(id, data, user);
};

exports.deleteRepair = async (id) => {
    await Repair.findByIdAndDelete(id);
    return true;
};

exports.listRepairs = async () => {
    return await Repair.find().sort({ createdAt: -1 });
};

exports.revenueReport = async (from, to) => {
    let filter = {};
    const moment = require('moment-timezone');
    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = moment(from).tz('Asia/Colombo').startOf('day').toDate();
        if (to) filter.createdAt.$lte = moment(to).tz('Asia/Colombo').endOf('day').toDate();
    }
    const repairs = await Repair.find(filter);
    const totalRevenue = repairs.reduce((sum, r) => sum + r.finalAmount, 0);
    const totalProfit = repairs.reduce((sum, r) => sum + r.profit, 0);
    return {
        count: repairs.length,
        totalRevenue,
        totalProfit,
        from,
        to
    };
};
