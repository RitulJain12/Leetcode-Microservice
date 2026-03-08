const problemModel = require('../models/problem.model');
async function createProblem(req, res) {
    try {
        const { updates } = req;
    
        const problem = await problemModel.create(updates);
        return res.status(201).json({ message: 'Problem created successfully', id:problem._id });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating problem', error });
    }
}

async function updateProblem(req, res) {
    try {
        const { updates } = req;
        if (!req.params.id) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }
        const problem = await problemModel.findByIdAndUpdate(req.params.id, updates, { new: true });
        return res.status(200).json({ message: 'Problem updated successfully', problem });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error updating problem', error });
    }
}


async function deleteProblem(req, res) {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }
        const problem = await problemModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Problem deleted successfully', problem });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error deleting problem', error });
    }
}

async function getProblem(req, res) {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }
        const problem = await problemModel.findById(req.params.id);
        return res.status(200).json({ message: 'Problem fetched successfully', problem });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching problem', error });
    }
}

async function getAllProblems(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const problems = await problemModel.find().skip(skip).limit(limit);
        const totalProblems = await problemModel.countDocuments();

        return res.status(200).json({
            message: 'Problems fetched successfully',
            problems,
            currentPage: page,
            totalPages: Math.ceil(totalProblems / limit),
            totalProblems
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching problems', error });
    }
}


module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblem,
    getAllProblems
};