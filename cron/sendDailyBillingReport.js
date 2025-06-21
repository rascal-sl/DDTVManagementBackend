const Bill = require('../models/bill.model');
const transporter = require('../config/mailer');
const User = require('../models/user.model');
const logger = require('../utils/logger');

async function sendDailyBillingReport() {
    try {
        const now = new Date();
        const today = new Date();
        today.setHours(0,0,0,0);

        // All bills created today
        const bills = await Bill.find({ createdAt: { $gte: today, $lte: now } });

        if (!bills.length) return;

        // Get super admins
        const superAdmins = await User.find({ role: 'super_admin', status: 'active' });
        const toEmails = superAdmins.map(u => u.email).join(',');

        // HTML summary
        let totalAmount = 0, totalProfit = 0, totalRecharge = 0, totalNormal = 0;
        let html = `
      <h2>DDTV Daily Billing Report - ${today.toLocaleDateString()}</h2>
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <tr>
          <th>Time</th>
          <th>Billed By</th>
          <th>Customer/Agent</th>
          <th>Card Number</th>
          <th>Product</th>
          <th>Type</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
    `;
        bills.forEach(bill => {
            (bill.products || []).forEach(product => {
                const isRecharge = product.productType === 'recharge';
                if (isRecharge) totalRecharge += product.quantity * product.billedPrice;
                else totalNormal += product.quantity * product.billedPrice;
                totalAmount += product.quantity * product.billedPrice;
                totalProfit += (product.billedPrice - product.actualCost) * product.quantity;
                html += `
        <tr>
          <td>${bill.createdAt.toLocaleString()}</td>
          <td>${bill.createdByName}</td>
          <td>
            ${bill.customer ? `${bill.customer.name} (Customer)` : bill.agent ? `${bill.agent.name} (Agent)` : 'N/A'}
          </td>
          <td>${bill.customer?.cardNumber || bill.agent?.cardNumber || ''}</td>
          <td>${product.name}</td>
          <td>${product.productType}</td>
          <td>${product.quantity}</td>
          <td>${product.billedPrice}</td>
          <td>${product.quantity * product.billedPrice}</td>
        </tr>
        `;
            });
        });
        html += `</table>`;
        html += `
      <h3>Summary:</h3>
      <ul>
        <li>Total Amount: <b>Rs. ${totalAmount}</b></li>
        <li>Total Recharge Sales: <b>Rs. ${totalRecharge}</b></li>
        <li>Total Normal Product Sales: <b>Rs. ${totalNormal}</b></li>
        <li>Total Profit: <b>Rs. ${totalProfit}</b></li>
        <li>Total Bills: <b>${bills.length}</b></li>
      </ul>
      <small>This is an automated email sent daily at 9:00 PM.</small>
    `;

        await transporter.sendMail({
            from: `"DDTV Billing System" <${process.env.SMTP_USER}>`,
            to: toEmails,
            subject: `[DDTV] Daily Billing Report - ${today.toLocaleDateString()}`,
            html
        });

        logger.success(`[${new Date().toISOString()}] Sent daily billing report to: ${toEmails}`);
    } catch (err) {
        logger.error(`[${new Date().toISOString()}] Error in sendDailyBillingReport: ${err.message}`);
    }
}

module.exports = sendDailyBillingReport;
