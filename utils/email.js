const nodemailer = require('nodemailer');

exports.sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.RECHARGE_MAIL_GMAIL,
            pass: process.env.RECHARGE_MAIL_PASS,
        }
    });
    await transporter.sendMail({
        from: process.env.RECHARGE_MAIL_GMAIL,
        to,
        subject,
        html,
    });
};
