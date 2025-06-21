const Bill = require('../models/bill.model');
const User = require('../models/user.model');
const transporter = require('../config/mailer');
const logger = require('../utils/logger');

/**
 * Sends a recharge bill summary (last 30 minutes) to all super admins.
 * Each row includes: Time, Billed By, Customer/Agent, Card Number, Product, Qty, Unit Price, Total.
 */
async function sendRechargeReport() {
    try {
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

        // Fetch all bills in last 30 min with at least one recharge product
        const bills = await Bill.find({
            createdAt: { $gte: thirtyMinsAgo, $lte: now },
            'products.productType': 'recharge'
        }).sort({ createdAt: 1 });

        if (!bills.length) {
            logger.success(`[${new Date().toISOString()}] No recharge activity in last 30 minutes. No email sent.`);
            return;
        }

        // Get all active super admin emails
        const superAdmins = await User.find({ role: 'super_admin', status: 'active' });
        const toEmails = superAdmins.map(u => u.email).join(',');

        // Build HTML email
        let html = `
      <h2>Recharge Activity Report (Last 30 Minutes)</h2>
      <p>Total Recharge Bills: <b>${bills.length}</b></p>
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <tr>
          <th>Time</th>
          <th>Billed By</th>
          <th>Customer/Agent</th>
          <th>Card Number</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
    `;

        bills.forEach(bill => {
            (bill.products || []).filter(p => p.productType === 'recharge').forEach(product => {
                html += `
          <tr>
            <td>${bill.createdAt.toLocaleString()}</td>
            <td>${bill.createdByName}</td>
            <td>
              ${bill.customer ? `${bill.customer.name} (Customer)` : bill.agent ? `${bill.agent.name} (Agent)` : 'N/A'}
            </td>
            <td>${bill.customer?.cardNumber || bill.agent?.cardNumber || ''}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.billedPrice}</td>
            <td>${product.quantity * product.billedPrice}</td>
          </tr>
        `;
            });
        });
        html += `</table>
      <p style="font-size:12px;color:#555;">This is an automated recharge report from DDTV Billing System.<br>Sent at: ${now.toLocaleString()}</p>
    `;

        // Send the email
        await transporter.sendMail({
            from: `"DDTV Billing System" <${process.env.SMTP_USER}>`,
            to: toEmails,
            subject: `[DDTV] Recharge Sales Report (Last 30 Min)`,
            html
        });

        logger.success(`[${new Date().toISOString()}] 30-min recharge report sent to: ${toEmails}`);
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] Error in sendRechargeReport: ${err.message}`);
    }
}

module.exports = sendRechargeReport;
