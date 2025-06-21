// Request logging middleware (optionally expand for advanced logging)
const morgan = require('morgan');

module.exports = morgan('dev'); // Logs HTTP requests to console
