const RepairStatus = require('../models/repairStatus.model');
const moment = require('moment-timezone');
const toSLTime = (date) => moment(date).tz('Asia/Colombo').toDate();

exports.createStatus = async (data, user) => {
    const exists = await RepairStatus.findOne({ name: data.name });
    if (exists) throw new Error('Status name already exists');
    return await RepairStatus.create({
        ...data,
        createdBy: user.id,
        createdByName: user.firstName,
        createdAt: toSLTime(Date.now())
    });
};

exports.getStatuses = async () => {
    return await RepairStatus.find().sort({ order: 1 });
};

exports.updateStatus = async (id, data, user) => {
    const status = await RepairStatus.findById(id);
    if (!status) throw new Error('Status not found');
    Object.assign(status, data);
    status.updatedBy = user.id;
    status.updatedByName = user.firstName;
    status.updatedAt = toSLTime(Date.now());
    await status.save();
    return status;
};

exports.deleteStatus = async (id) => {
    await RepairStatus.findByIdAndDelete(id);
    return true;
};
