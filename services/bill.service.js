const Bill = require('../models/bill.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const moment = require('moment-timezone');

/**
 * Helper: Convert date to Sri Lankan time
 */
const toSLTime = (date) => moment(date).tz('Asia/Colombo').toDate();

/**
 * Create a bill for normal products, auto-fetch customer, and decrement stock
 */
exports.createBill = async (billData, user) => {
    // Fetch customer
    const customer = await Customer.findById(billData.customerId);
    if (!customer) throw new Error('Customer not found');

    // Validate products, check stock, prepare bill product array
    let totalAmount = 0, profit = 0, productsArray = [];
    for (const p of billData.products) {
        const prod = await Product.findById(p.productId);
        if (!prod) throw new Error(`Product not found: ${p.productId}`);
        if (prod.productType !== 'normal') throw new Error('Only normal products allowed');
        if (prod.quantity < p.quantity)
            throw new Error(`Insufficient stock for product: ${prod.name}`);
        const itemProfit = (p.billedPrice - prod.buyingPrice) * p.quantity;
        profit += itemProfit;
        totalAmount += p.billedPrice * p.quantity;
        productsArray.push({
            productId: prod._id,
            name: prod.name,
            quantity: p.quantity,
            billedPrice: p.billedPrice,
            actualCost: prod.buyingPrice
        });
        prod.quantity -= p.quantity;
        await prod.save();
    }

    // Store bill with customer snapshot
    return await Bill.create({
        customer: {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phoneNumber: customer.phoneNumber,
            email: customer.email || '',
            cardNumber: customer.cardNumber
        },
        products: productsArray,
        totalAmount,
        profit,
        createdBy: user.id,
        createdByName: user.firstName,
        createdAt: toSLTime(Date.now())
    });
};

/**
 * Fetch all bills (role-based): admins = today, super_admins = all or by date/range
 */
exports.getAllBills = async (user, from, to) => {
    let filter = {};
    if (user.role === 'admin') {
        // Only today (SL time)
        const start = moment().tz('Asia/Colombo').startOf('day');
        const end = moment().tz('Asia/Colombo').endOf('day');
        filter.createdAt = { $gte: start.toDate(), $lte: end.toDate() };
    } else if (user.role === 'super_admin' && (from || to)) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = moment(from).tz('Asia/Colombo').startOf('day').toDate();
        if (to) filter.createdAt.$lte = moment(to).tz('Asia/Colombo').endOf('day').toDate();
    }
    return await Bill.find(filter).sort({ createdAt: -1 });
};

/**
 * Get all bills by customer id
 */
exports.getBillsByCustomerId = async (customerId) => {
    return await Bill.find({ "customer.id": customerId }).sort({ createdAt: -1 });
};

/**
 * Revenue/profit report for any date range (super admin)
 */
exports.getRevenueReport = async (from, to) => {
    let filter = {};
    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = moment(from).tz('Asia/Colombo').startOf('day').toDate();
        if (to) filter.createdAt.$lte = moment(to).tz('Asia/Colombo').endOf('day').toDate();
    }
    const bills = await Bill.find(filter);
    const totalSales = bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalProfit = bills.reduce((sum, b) => sum + b.profit, 0);
    return {
        count: bills.length,
        totalSales,
        totalProfit,
        from: from ? moment(from).format('YYYY-MM-DD') : undefined,
        to: to ? moment(to).format('YYYY-MM-DD') : undefined
    };
};

/**
 * Get a single bill by its id
 */
exports.getBillById = async (id) => {
    return await Bill.findById(id);
};

/**
 * Update bill: reverse old stock, apply new stock, recalculate profit/total, audit fields
 * (super admin only)
 */
exports.updateBillById = async (id, updateData, user) => {
    const bill = await Bill.findById(id);
    if (!bill) return null;

    // Step 1: Restore old stock for each product in bill
    for (const oldP of bill.products) {
        const prod = await Product.findById(oldP.productId);
        if (prod) {
            prod.quantity += oldP.quantity;
            await prod.save();
        }
    }

    // Step 2: Validate and apply new products
    let totalAmount = 0, profit = 0, newProductsArray = [];
    for (const newP of updateData.products) {
        const prod = await Product.findById(newP.productId);
        if (!prod) throw new Error(`Product not found: ${newP.productId}`);
        if (prod.productType !== 'normal') throw new Error('Only normal products allowed');
        if (prod.quantity < newP.quantity)
            throw new Error(`Insufficient stock for product: ${prod.name}`);
        const itemProfit = (newP.billedPrice - prod.buyingPrice) * newP.quantity;
        profit += itemProfit;
        totalAmount += newP.billedPrice * newP.quantity;
        prod.quantity -= newP.quantity;
        await prod.save();

        newProductsArray.push({
            productId: prod._id,
            name: prod.name,
            quantity: newP.quantity,
            billedPrice: newP.billedPrice,
            actualCost: prod.buyingPrice
        });
    }

    // Step 3: Update bill fields
    bill.products = newProductsArray;
    bill.totalAmount = totalAmount;
    bill.profit = profit;
    bill.updatedBy = user.id;
    bill.updatedByName = user.firstName;
    bill.updatedAt = toSLTime(Date.now());
    await bill.save();
    return bill;
};

/**
 * Delete bill (super admin only): restore all product stock
 */
exports.deleteBillById = async (id, user) => {
    const bill = await Bill.findById(id);
    if (!bill) return null;

    // Restore product quantities
    for (const p of bill.products) {
        const prod = await Product.findById(p.productId);
        if (prod) {
            prod.quantity += p.quantity;
            await prod.save();
        }
    }

    await Bill.deleteOne({ _id: id });
    return true;
};
