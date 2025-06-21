// Global error handler middleware. Catches and logs all errors.
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
