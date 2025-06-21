// Main Express app config
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger'); // Morgan logger middleware
const errorHandler = require('./middleware/errorHandler');
const cron = require('node-cron');
const sendRechargeReport = require('./cron/sendRechargeReport');
const sendDailyBillingReport = require('./cron/sendDailyBillingReport');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// ROUTES
app.use('/api', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admins', require('./routes/admin.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/bills', require('./routes/bill.routes'));
app.use('/api/repairs', require('./routes/repair.routes'));
app.use('/api/customers', require('./routes/customerHistory.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/expense-categories', require('./routes/expenseCategory.routes'));

// CRON: 30-min recharge, 9pm daily summary
cron.schedule('0,30 * * * *', async () => await sendRechargeReport());
cron.schedule('0 21 * * *', async () => await sendDailyBillingReport());

// Global Error Handler
app.use(errorHandler);

module.exports = app;
