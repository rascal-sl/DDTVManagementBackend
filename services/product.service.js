const Product = require('../models/product.model');
const mongoose = require('mongoose');

const createProduct = async (data) => {
    if (await Product.findOne({ name: data.name })) {
        throw new Error('Product name already exists');
    }
    return new Product(data).save();
};

const updateProduct = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');
    return Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');
    return Product.findByIdAndDelete(id);
};

const getAllProducts = async () => Product.find().lean();

const searchProducts = async (q, type) => {
    const query = {};
    if (q) query.name = { $regex: q, $options: 'i' };
    if (type) query.productType = type;
    return Product.find(query).lean();
};

const topUpRechargeProduct = async (id, topUpValue, topUpCost, updatedBy, updatedByName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');
    const prod = await Product.findById(id);
    if (!prod) throw new Error('Product not found');
    if (prod.productType !== 'recharge') throw new Error('Only recharge products can be topped up');
    prod.rechargeBalance += topUpValue;
    prod.buyingPrice = topUpCost; // (optional: update last cost)
    prod.updatedBy = updatedBy;
    prod.updatedByName = updatedByName;
    await prod.save();
    return prod;
};

module.exports = {
    createProduct, updateProduct, deleteProduct,
    getAllProducts, searchProducts, topUpRechargeProduct
};
