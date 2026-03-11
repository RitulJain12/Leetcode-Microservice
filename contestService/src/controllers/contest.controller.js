
const contestModel = require('../models/contest.model');

const axios = require('axios');
const broker = require('../services/broker');
const { contestQueue } = require('../config/queue.config');


async function createcontest(req, res) {
    console.log(req.body);
    const { name, description, startTime, endTime, duration, contestTotalPoints, questions, contesturl } = req.body;
    try {
        const contest = new contestModel({
            name,
            description,
            startTime,
            endTime,
            duration,
            contestTotalPoints,
            contesturl,
            imageUrl: contesturl,
            questions: questions || []
        });
        const { data } = await axios.get('http://localhost:8010/api/aiservice/create/contestquestion');
        console.log("AI Service Response:", JSON.stringify(data, null, 2));

        if (data && data.success && Array.isArray(data.questions)) {
            const savedQuestions = [];
            for (const q of data.questions) {
                try {
                    // Map AI response to problem service schema
                    const problemData = {
                        title: q.title,
                        description: q.description,
                        difficulty: q.difficulty || "Medium",
                        tags: q.tags || q.topics || ["AI Generated"],
                        topics: q.topics || ["AI Generated"],
                        hints: Array.isArray(q.hints) ? q.hints : [q.hints || "No hints available"],
                        companies: q.companies || ["Unknown"],
                        problemfunctionName: q.problemfunctionName || q.title.replace(/\s+/g, ''),
                        functionSignatures: Object.entries(q.signature || q.functionSignatures || {}).map(([lang, sig]) => ({
                            language: lang,
                            functionName: q.problemfunctionName || q.title.replace(/\s+/g, ''),
                            returnType: "any",
                            parameters: []
                        })),
                        BoilerPlate: Object.entries(q.boilerplate || q.BoilerPlate || {}).map(([lang, code]) => ({
                            language: lang,
                            Boilercode: code
                        })),
                        ReffSolution: Object.entries(q.referenceSolution || q.ReffSolution || {}).map(([lang, code]) => ({
                            language: lang,
                            Fullcode: code
                        })),
                        visibleTestCases: (q.testCases || q.testcases || []).map(tc => ({
                            input: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input),
                            output: typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output),
                            explanation: tc.explanation || "No explanation provided"
                        })),
                        invisibleTestCases: (q.invisibleTestCases || q.invisible_testcases || []).map(tc => ({
                            input: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input),
                            output: typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output)
                        }))
                    };


                    if (problemData.visibleTestCases.length === 0) {
                        problemData.visibleTestCases.push({ input: "Default", output: "Default", explanation: "Default" });
                    }
                    if (problemData.invisibleTestCases.length === 0) {
                        problemData.invisibleTestCases.push({ input: "Default", output: "Default" });
                    }

                    const probRes = await axios.post('http://localhost:8002/api/problems/create', problemData);
                    console.log("Problem Service Response:", JSON.stringify(probRes.data, null, 2));
                    if (probRes.data && probRes.data.id) {
                        savedQuestions.push({
                            questionId: probRes.data.id,
                            points: q.points || (q.difficulty === 'Easy' ? 5 : q.difficulty === 'Medium' ? 10 : 20),
                            penalty: q.penalty || 2
                        });
                    }
                } catch (err) {
                    console.error(`Failed to save AI question "${q.title}":`, err.message);
                }
            }
            contest.questions = savedQuestions;
            console.log("Contest Questions:", JSON.stringify(contest.questions, null, 2));
        } else {
            console.warn("AI Service did not return valid questions. Using empty array.");
            contest.questions = [];
        }
        await contest.save();

        const now = Date.now();
        const startDelay = new Date(startTime).getTime() - now;
        const endDelay = new Date(endTime).getTime() - now;

        if (startDelay > 0) {
            await contestQueue.add('contest-start', { contestId: contest._id }, { delay: startDelay, jobId: `start-${contest._id}` });
        } else {
            await contestQueue.add('contest-start', { contestId: contest._id }, { jobId: `start-${contest._id}` });
        }

        if (endDelay > 0) {
            await contestQueue.add('contest-end', { contestId: contest._id }, { delay: endDelay, jobId: `end-${contest._id}` });
        }

        res.status(201).json({ message: "Contest created successfully", contest });
    } catch (error) {
        console.error("Create Contest Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

async function updatecontest(req, res) {
    const { contestId } = req.params;
    const { name, description, startTime, endTime, duration, contestTotalPoints, questions, contesturl, imageUrl } = req.body;
    try {
        const contest = await contestModel.findByIdAndUpdate(contestId, {
            name,
            description,
            startTime,
            endTime,
            duration,
            contestTotalPoints,
            contesturl,
            imageUrl,
            questions: questions || []
        }, { new: true });

        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        // Ideally here you'd update the queues if times changed, but for now we'll just update the DB
        res.status(200).json({ message: "Contest updated successfully", contest });
    } catch (error) {
        console.error("Update Contest Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function registerforcontest(req, res) {
    const { id: contestId } = req.params;
    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const userId = req.user.id;
        const alreadyRegistered = contest.users.find(u => u.id.toString() === userId);

        if (alreadyRegistered) {
            return res.status(400).json({ message: "User already registered for this contest" });
        }

        contest.users.push({ id: userId });
        await contest.save();

        res.status(200).json({ message: "Contest registered successfully", contest });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function checkregistration(req, res) {
    const { id: contestId } = req.query; // often sent as query or calculated from params
    const cid = contestId || req.params.id;
    try {
        const contest = await contestModel.findById(cid);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const userId = req.user.id;
        const isRegistered = contest.users.some(u => u.id.toString() === userId);

        res.status(200).json({ registered: isRegistered });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deregistration(req, res) {
    const { contestId } = req.params;
    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.contests.includes(contestId)) {
            return res.status(400).json({ message: "User not registered for this contest" });
        }
        user.contests.pull(contestId);
        await user.save();
        res.status(200).json({ message: "Contest deregistered successfully", contest });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

async function getcontest(req, res) {
    const { contestId } = req.params;
    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const isRegistered = contest.users.some(u => u.id.toString() === req.user.id);

        res.status(200).json({
            message: "Contest found",
            contest,
            isRegistered
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getallcontests(req, res) {
    try {
        const contests = await contestModel.find();
        if (!contests) {
            return res.status(404).json({ message: "Contests not found" });
        }
        res.status(200).json({ message: "Contests found", contests });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


async function deletecontest(req, res) {
    const { contestId } = req.params;
    try {
        const contest = await contestModel.findByIdAndDelete(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        res.status(200).json({ message: "Contest deleted successfully", contest });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}




module.exports = {
    createcontest,
    updatecontest,
    registerforcontest,
    checkregistration,
    deregistration,
    getcontest,
    getallcontests,
    deletecontest
}