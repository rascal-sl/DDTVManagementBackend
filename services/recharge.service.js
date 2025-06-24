const RechargeTopup = require('../models/rechargeTopup.model');
const RechargeSale = require('../models/rechargeSale.model');
const Customer = require('../models/customer.model');
const Agent = require('../models/agent.model');
const moment = require('moment-timezone');

// Helper for Sri Lankan time
const toSLTime = (date) => moment(date).tz('Asia/Colombo').toDate();

// Calculate total bought (top-ups) and sold (sales) for a given type
async function getBalance(rechargeType) {
    const [topup] = await RechargeTopup.aggregate([
        { $match: { rechargeType } },
        { $group: { _id: null, total: { $sum: '$topUpValue' } } }
    ]);
    const [sale] = await RechargeSale.aggregate([
        { $match: { rechargeType } },
        { $group: { _id: null, total: { $sum: '$soldValue' } } }
    ]);
    return (topup?.total || 0) - (sale?.total || 0);
}

// Calculate weighted average unit cost for a recharge type
async function getUnitCost(rechargeType) {
    const topups = await RechargeTopup.find({ rechargeType });
    let totalValue = 0, totalCost = 0;
    for (const t of topups) {
        totalValue += t.topUpValue;
        totalCost += t.topUpCost;
    }
    return totalValue ? (totalCost / totalValue) : 0;
}

exports.createTopup = async (data, user) => {
    return RechargeTopup.create({
        ...data,
        topUpDate: toSLTime(data.topUpDate),
        createdBy: user.id,
        createdByName: user.firstName
    });
};

exports.updateTopup = async (id, data, user) => {
    return RechargeTopup.findByIdAndUpdate(id, {
        ...data,
        topUpDate: toSLTime(data.topUpDate),
        updatedBy: user.id,
        updatedByName: user.firstName
    }, { new: true });
};

exports.deleteTopup = async (id) => {
    return RechargeTopup.findByIdAndDelete(id);
};

exports.listTopups = async (filter = {}) => {
    return RechargeTopup.find(filter).sort({ topUpDate: -1 });
};

exports.getBalances = async () => {
    const types = ['Dialog', 'DDTV', 'Mobitel', 'Hutch', 'Airtel'];
    let balances = {};
    for (const type of types) {
        balances[type] = await getBalance(type);
    }
    return balances;
};

exports.sellRecharge = async (data, user) => {
    // Fetch customer/agent and their name
    let soldTo;
    if (data.soldToType === 'customer') {
        soldTo = await Customer.findById(data.soldToId);
        if (!soldTo) throw new Error('Customer not found');
    } else if (data.soldToType === 'agent') {
        soldTo = await Agent.findById(data.soldToId);
        if (!soldTo) throw new Error('Agent not found');
    }
    // Check enough balance
    const balance = await getBalance(data.rechargeType);
    if (data.soldValue > balance) throw new Error('Insufficient recharge balance');
    // Calculate unit cost and profit
    const unitCost = await getUnitCost(data.rechargeType);
    const profit = data.soldPrice - (data.soldValue * unitCost);
    // Store
    return RechargeSale.create({
        rechargeType: data.rechargeType,
        soldValue: data.soldValue,
        soldPrice: data.soldPrice,
        unitCost,
        profit,
        soldToType: data.soldToType,
        soldToId: data.soldToId,
        soldToName: soldTo.firstName + ' ' + soldTo.lastName,
        createdBy: user.id,
        createdByName: user.firstName,
        saleDate: toSLTime(Date.now())
    });
};

exports.listSales = async (filter = {}) => {
    return RechargeSale.find(filter).sort({ saleDate: -1 });
};

exports.getRevenueAndProfit = async (filter = {}) => {
    const sales = await RechargeSale.find(filter);
    const totalRevenue = sales.reduce((sum, s) => sum + s.soldPrice, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    return { totalRevenue, totalProfit };
};
