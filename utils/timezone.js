const moment = require('moment-timezone');

exports.getSriLankaTime = () => moment().tz('Asia/Colombo').toDate();
exports.formatSriLankaTime = date => moment(date).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm');
