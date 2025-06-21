/**
 * Auth Service: Handles DB operations related to authentication.
 */
const User = require('../models/user.model');

const createUser = async (userData) => {
    // Only create if email is unique
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new Error('Email already in use');
    return await User.create(userData);
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

module.exports = { createUser, getUserByEmail };
