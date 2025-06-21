// MongoDB connection setup using Mongoose
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.success('MongoDB Connected');
    } catch (error) {
        logger.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

