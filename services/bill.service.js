const Bill = require('../models/bill.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');
const Agent = require('../models/agent.model');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * Create a bill with business logic for products and price validation.
 */
exports.createBill = async (data, user) => {
    // Validate target
    let target;
    if (data.customer) {
        if (!mongoose.Types.ObjectId.isValid(data.customer.id)) throw new Error('Invalid customer ID');
        target = await Customer.findById(data.customer.id);
        if (!target) throw new Error('Customer not found');
        if (!target.whatsappNumber) throw new Error('Customer WhatsApp number not set');
    } else if (data.agent) {
        if (!mongoose.Types.ObjectId.isValid(data.agent.id)) throw new Error('Invalid agent ID');
        target = await Agent.findById(data.agent.id);
        if (!target) throw new Error('Agent not found');
        if (!target.whatsappNumber) throw new Error('Agent WhatsApp number not set');
    } else {
        throw new Error('Either customer or agent must be provided');
    }

    // Product checks and updates
    let totalProfit = 0;
    for (const item of data.products) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.name}`);

        if (product.productType === 'recharge') {
            const allowedMin = product.sellingPrice - 5;
            if (item.billedPrice > product.sellingPrice)
                throw new Error(`Recharge price cannot be increased above Rs. ${product.sellingPrice}`);
            if (item.billedPrice < allowedMin)
                throw new Error(`Maximum allowed discount is Rs. 5. You must bill Rs. ${allowedMin} or more`);
            if (product.rechargeBalance < item.quantity * item.billedPrice)
                throw new Error('Insufficient recharge balance');
            product.rechargeBalance -= item.quantity * item.billedPrice;
        } else if (product.productType === 'normal') {
            if (product.quantity < item.quantity)
                throw new Error(`Insufficient quantity for ${product.name}`);
            if (item.billedPrice !== product.sellingPrice)
                throw new Error('No override allowed for normal products');
            product.quantity -= item.quantity;
        }
        totalProfit += (item.billedPrice - item.actualCost) * item.quantity;
        await product.save();
    }

    const billObj = {
        ...data,
        profit: totalProfit,
        createdBy: user.id,
        createdByName: user.firstName,
        updatedBy: user.id,
        updatedByName: user.firstName
    };

    const bill = await Bill.create(billObj);

    logger.userAction(`[${new Date().toISOString()}] ACTION: createBill by ${user.role} ${user.firstName} (ID: ${user.id}) - Status: SUCCESS - Bill ID: ${bill._id}`);

    return bill;
};

/**
 * Get all bills for today (admin view)
 */
exports.getTodaysBills = async (user) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Only created today
    const query = { createdAt: { $gte: today, $lt: tomorrow } };
    return Bill.find(query).sort({ createdAt: -1 });
};

/**
 * Super admin: Filter bills
 */
exports.filterBills = async (query) => {
    const filter = {};
    if (query.customer) filter['customer.name'] = { $regex: query.customer, $options: 'i' };
    if (query.nic) filter['customer.nic'] = query.nic;
    if (query.cardNumber) filter['customer.cardNumber'] = query.cardNumber;
    if (query.phone) filter['customer.phone'] = query.phone;
    if (query.agent) filter['agent.name'] = { $regex: query.agent, $options: 'i' };
    if (query.product) filter['products.name'] = { $regex: query.product, $options: 'i' };
    if (query.start && query.end) {
        filter.createdAt = {
            $gte: new Date(query.start),
            $lte: new Date(query.end)
        };
    }
    return Bill.find(filter).sort({ createdAt: -1 });
};

/**
 * Get bill by ID
 */
exports.getBillById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid bill ID');
    const bill = await Bill.findById(id);
    if (!bill) throw new Error('Bill not found');
    return bill;
};

/**
 * Edit bill (super admin only)
 */
exports.editBill = async (id, data, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid bill ID');
    const bill = await Bill.findByIdAndUpdate(
        id,
        { ...data, updatedBy: user.id, updatedByName: user.firstName },
        { new: true }
    );
    if (!bill) throw new Error('Bill not found');
    logger.userAction(`[${new Date().toISOString()}] ACTION: editBill by ${user.role} ${user.firstName} (ID: ${user.id}) - Status: SUCCESS - Bill ID: ${bill._id}`);
    return bill;
};

/**
 * Delete bill (super admin only)
 */
exports.deleteBill = async (id, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid bill ID');
    const bill = await Bill.findByIdAndDelete(id);
    if (!bill) throw new Error('Bill not found');
    logger.userAction(`[${new Date().toISOString()}] ACTION: deleteBill by ${user.role} ${user.firstName} (ID: ${user.id}) - Status: SUCCESS - Bill ID: ${id}`);
    return bill;
};
