const RepairIssue = require('../models/repairIssue.model');
const moment = require('moment-timezone');
const toSLTime = (date) => moment(date).tz('Asia/Colombo').toDate();

exports.createIssue = async (data, user) => {
    const exists = await RepairIssue.findOne({ name: data.name });
    if (exists) throw new Error('Issue name already exists');
    return await RepairIssue.create({
        ...data,
        createdBy: user.id,
        createdByName: user.firstName,
        createdAt: toSLTime(Date.now())
    });
};

exports.getIssues = async () => {
    return await RepairIssue.find().sort({ name: 1 });
};

exports.updateIssue = async (id, data, user) => {
    const issue = await RepairIssue.findById(id);
    if (!issue) throw new Error('Issue not found');
    Object.assign(issue, data);
    issue.updatedBy = user.id;
    issue.updatedByName = user.firstName;
    issue.updatedAt = toSLTime(Date.now());
    await issue.save();
    return issue;
};

exports.deleteIssue = async (id) => {
    await RepairIssue.findByIdAndDelete(id);
    return true;
};
