const Bill = require('../models/bill.model');
const Repair = require('../models/repair.model');
const { formatSriLankaTime } = require('../utils/timezone');

// Bills with only NORMAL products
exports.getNormalProductBills = async (customerId) => {
    // Find all bills for customer where *all* products are type 'normal'
    const bills = await Bill.find({
        'customer.id': customerId,
        'products.productType': 'normal'
    }).sort({ createdAt: -1 });

    return bills.map(bill => ({
        date: formatSriLankaTime(bill.createdAt),
        products: bill.products.filter(p => p.productType === 'normal').map(p => ({
            name: p.name,
            qty: p.quantity,
            price: p.billedPrice
        })),
        total: bill.totalAmount,
        createdByName: bill.createdByName
    }));
};

// Bills with any RECHARGE products
exports.getRechargeBills = async (customerId) => {
    // Find all bills for customer with at least one recharge product
    const bills = await Bill.find({
        'customer.id': customerId,
        'products.productType': 'recharge'
    }).sort({ createdAt: -1 });

    let output = [];
    bills.forEach(bill => {
        bill.products.filter(p => p.productType === 'recharge').forEach(product => {
            output.push({
                date: formatSriLankaTime(bill.createdAt),
                cardNumber: bill.customer?.cardNumber || "",
                rechargeType: product.name,
                rechargedValue: product.quantity * product.billedPrice,
                billedPrice: product.billedPrice,
                createdByName: bill.createdByName
            });
        });
    });
    return output;
};

exports.getRepairs = async (customerId) => {
    const repairs = await Repair.find({ customerId }).sort({ createdAt: -1 });
    return repairs.map(repair => ({
        dateIn: repair.receivedFromCustomerAt,
        repairProduct: repair.repairProduct,
        issues: repair.issues,
        ddtvCharge: repair.ddtvPrice,
        companyCharge: repair.companyPrice,
        discount: repair.discount,
        finalAmount: repair.finalAmount,
        status: repair.status,
        createdByName: repair.createdByName
    }));
};
