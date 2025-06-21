/**
 * Centralized logger using Winston.
 * Logs errors, successes, and user actions to files in /logs directory.
 */
const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

// Factory function for creating loggers for different log files
const createLogger = (filename) => winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, filename) }),
    ],
});

// Define all loggers using the factory function
const errorLogger = createLogger('error.log');
const successLogger = createLogger('success.log');
const userActionLogger = createLogger('user-actions.log');

// Export functions for logging different types of messages
module.exports = {
    error: (msg, meta) => errorLogger.error({ message: msg, ...meta }),
    success: (msg, meta) => successLogger.info({ message: msg, ...meta }),
    userAction: (msg, meta) => userActionLogger.info({ message: msg, ...meta }),
};
