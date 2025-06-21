const healthService = require('../services/healthService');

exports.getHealth = (req, res) => {
    const result = healthService.healthStatus();
    res.json(result);
};
