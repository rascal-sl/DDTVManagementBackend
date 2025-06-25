const RechargeSale = require('../models/rechargeSale.model');
const Customer = require('../models/customer.model');
const Agent = require('../models/agent.model');
const { sendMail } = require('../utils/email');
const moment = require('moment-timezone');

module.exports = async function sendRechargeReport(rechargeType = null) {
    // Step 1: Time window: last 30 mins in SL time
    const now = moment().tz('Asia/Colombo');
    const since = now.clone().subtract(30, 'minutes');
    let filter = {
        saleDate: { $gte: since.toDate(), $lte: now.toDate() }
    };
    if (rechargeType) filter.rechargeType = rechargeType;

    const sales = await RechargeSale.find(filter);

    if (!sales.length) return; // nothing to report

    // Step 2: Recipient emails (from .env)
    const emails = (process.env.SUPER_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    if (!emails.length) return;

    // Step 3: Build the report table
    let rows = '';
    for (const sale of sales) {
        let buyer, phone = '', cardNumber = '';
        if (sale.soldToType === 'customer') {
            buyer = await Customer.findById(sale.soldToId);
            if (buyer) {
                phone = buyer.phoneNumber;
                cardNumber = buyer.cardNumber;
            }
        } else if (sale.soldToType === 'agent') {
            buyer = await Agent.findById(sale.soldToId);
            if (buyer) phone = buyer.phoneNumber;
        }
        rows += `
      <tr>
        <td>${sale.rechargeType}</td>
        <td>${sale.soldValue}</td>
        <td>${sale.soldPrice}</td>
        <td>${sale.soldToName || '-'}</td>
        <td>${phone || '-'}</td>
        <td>${cardNumber || '-'}</td>
        <td>${sale.createdByName || '-'}</td>
        <td>${moment(sale.saleDate).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm')}</td>
      </tr>`;
    }

    const html = `
    <h2>Recharge Sales Report (Last 30 Minutes)${rechargeType ? ` – ${rechargeType}` : ''}</h2>
    <table border="1" cellpadding="4" cellspacing="0">
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Sold Price</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Card Number</th>
        <th>Sold By</th>
        <th>Date</th>
      </tr>
      ${rows}
    </table>
    <p>Report Time: ${now.format('YYYY-MM-DD HH:mm:ss')} (Sri Lanka time)</p>
  `;

    await sendMail({
        to: emails.join(','),
        subject: `Recharge Sales Report (${rechargeType || 'All Types'}): ${now.format('YYYY-MM-DD HH:mm')}`,
        html
    });
};
