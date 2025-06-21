const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const logger = require('../utils/logger');

exports.createExpense = async (data, user) => {
    const category = await ExpenseCategory.findById(data.categoryId);
    if (!category) throw new Error('Category not found.');
    const expense = await Expense.create({
        ...data,
        createdBy: user.id,
        createdByName: user.firstName
    });
    logger.userAction(`[${new Date().toISOString()}] CREATE_EXPENSE: Rs. ${expense.amount} - ${category.name} by ${user.firstName}`);
    return expense;
};

exports.getExpenses = async (filter = {}) => {
    const query = {};
    if (filter.category) {
        // filter by category name (not id)
        const category = await ExpenseCategory.findOne({ name: filter.category });
        if (category) query.categoryId = category._id;
        else return [];
    }
    if (filter.from && filter.to) {
        query.expenseDate = {
            $gte: new Date(filter.from),
            $lte: new Date(filter.to)
        };
    }
    return Expense.find(query).populate('categoryId', 'name').sort({ expenseDate: -1 });
};

exports.updateExpense = async (id, data, user) => {
    const expense = await Expense.findById(id);
    if (!expense) throw new Error('Expense not found.');
    if (data.categoryId) {
        const category = await ExpenseCategory.findById(data.categoryId);
        if (!category) throw new Error('Category not found.');
        expense.categoryId = data.categoryId;
    }
    if (data.amount) expense.amount = data.amount;
    if ('description' in data) expense.description = data.description;
    if (data.expenseDate) expense.expenseDate = data.expenseDate;
    expense.updatedBy = user.id;
    expense.updatedByName = user.firstName;
    expense.updatedAt = new Date();
    await expense.save();
    logger.userAction(`[${new Date().toISOString()}] UPDATE_EXPENSE: ID ${id} by ${user.firstName}`);
    return expense;
};

exports.deleteExpense = async (id, user) => {
    const exp = await Expense.findByIdAndDelete(id);
    if (!exp) throw new Error('Expense not found.');
    logger.userAction(`[${new Date().toISOString()}] DELETE_EXPENSE: ID ${id} by ${user.firstName}`);
    return exp;
};
