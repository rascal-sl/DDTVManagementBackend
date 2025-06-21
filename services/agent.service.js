/**
 * Agent Service – DB logic and validation.
 */
const Agent = require('../models/agent.model');
const mongoose = require('mongoose');

const createAgent = async (data) => {
    // Prevent duplicates
    const exists = await Agent.findOne({
        $or: [
            { nicNumber: data.nicNumber },
            { phoneNumber: data.phoneNumber }
        ]
    });
    if (exists) throw new Error('NIC or phone already exists for another agent.');
    if (!data.createdBy || !data.createdByName) throw new Error('Audit fields missing');
    const agent = new Agent(data);
    await agent.save();
    return agent;
};

const getAllAgents = async () => {
    return Agent.find({}).select('-__v').lean();
};

const searchAgents = async (query) => {
    const filters = [];
    if (query.firstName) filters.push({ firstName: { $regex: query.firstName, $options: 'i' } });
    if (query.lastName) filters.push({ lastName: { $regex: query.lastName, $options: 'i' } });
    if (query.nicNumber) filters.push({ nicNumber: { $regex: query.nicNumber, $options: 'i' } });
    if (query.phoneNumber) filters.push({ phoneNumber: { $regex: query.phoneNumber, $options: 'i' } });
    return Agent.find(filters.length ? { $or: filters } : {}).select('-__v').lean();
};

const updateAgent = async (id, data, userId, userName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid agent ID');
    const agent = await Agent.findById(id);
    if (!agent) throw new Error('Agent not found');
    if (data.nicNumber || data.phoneNumber) {
        const conflict = await Agent.findOne({
            _id: { $ne: id },
            $or: [
                data.nicNumber ? { nicNumber: data.nicNumber } : null,
                data.phoneNumber ? { phoneNumber: data.phoneNumber } : null,
            ].filter(Boolean)
        });
        if (conflict) throw new Error('Another agent has this NIC or phone');
    }
    Object.assign(agent, data, { updatedBy: userId, updatedByName: userName });
    await agent.save();
    return agent;
};

const deleteAgent = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid agent ID');
    const result = await Agent.findByIdAndDelete(id);
    if (!result) throw new Error('Agent not found');
};

module.exports = {
    createAgent,
    getAllAgents,
    searchAgents,
    updateAgent,
    deleteAgent
};
