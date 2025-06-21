const ExpenseCategory = require('../models/expenseCategory.model');
const logger = require('../utils/logger');

exports.createCategory = async (data, user) => {
    const category = await ExpenseCategory.create({
        name: data.name,
        createdBy: user.id,
        createdByName: user.firstName
    });
    logger.userAction(`[${new Date().toISOString()}] CREATE_CATEGORY: ${category.name} by ${user.firstName}`);
    return category;
};

exports.getCategories = async () => {
    return ExpenseCategory.find().sort({ name: 1 });
};

exports.updateCategory = async (id, data, user) => {
    const cat = await ExpenseCategory.findById(id);
    if (!cat) throw new Error('Category not found.');
    cat.name = data.name;
    cat.updatedAt = new Date();
    await cat.save();
    logger.userAction(`[${new Date().toISOString()}] UPDATE_CATEGORY: ${id} by ${user.firstName}`);
    return cat;
};

exports.deleteCategory = async (id, user) => {
    const deleted = await ExpenseCategory.findByIdAndDelete(id);
    if (!deleted) throw new Error('Category not found.');
    logger.userAction(`[${new Date().toISOString()}] DELETE_CATEGORY: ${id} by ${user.firstName}`);
    return deleted;
};
