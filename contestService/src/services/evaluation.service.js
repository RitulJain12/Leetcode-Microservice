const contestModel = require('../models/contest.model');

async function evaluateContest(contestId) {
    console.log(`Starting evaluation for contest ${contestId}`);
    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) return;


        contest.users.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            return new Date(a.finishedAt) - new Date(b.finishedAt);
        });

        contest.users.forEach((user, index) => {
            user.rank = index + 1;
        });

        const broker = require('../services/broker');
        await contest.save();

        
        await broker.publishToQueue('CONTEST_UPDATES', JSON.stringify({
            type: 'CONTEST_FINAL_RESULTS',
            contestId: contest._id,
            results: contest.users.map(u => ({
                userId: u.id,
                score: u.score,
                rank: u.rank,
                finishedAt: u.finishedAt
            }))
        }));

        console.log(`Evaluation completed and results published for contest ${contestId}`);
    } catch (error) {
        console.error(`Evaluation failed for contest ${contestId}:`, error);
    }
}

module.exports = {
    evaluateContest
};
