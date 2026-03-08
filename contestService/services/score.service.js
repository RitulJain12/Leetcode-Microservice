const contestModel = require('../models/contest.model');

async function handleScoreUpdate(data) {
    const { userId, contestId, points, solvedAt } = data;
    console.log(`Updating score for user ${userId} in contest ${contestId}`);

    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) {
            console.error(`Contest ${contestId} not found for score update`);
            return;
        }

        const { connection } = require('../config/queue.config');
        const socketService = require('./socket.service');

        const userIndex = contest.users.findIndex(u => u.id.toString() === userId.toString());

        if (userIndex === -1) {
            contest.users.push({
                id: userId,
                score: points,
                finishedAt: solvedAt || new Date()
            });
        } else {
            contest.users[userIndex].score += points;
            contest.users[userIndex].finishedAt = solvedAt || new Date();
        }

        await contest.save();

        const finalScore = userIndex === -1 ? points : contest.users[userIndex].score;
        const finalFinishedAt = solvedAt || new Date();

        const compositeScore = finalScore + (1 - (new Date(finalFinishedAt).getTime() / 10000000000000));
        const redisKey = `leaderboard:${contestId}`;
        await connection.zadd(redisKey, compositeScore, userId.toString());
        
        socketService.emitToContest(contestId, 'leaderboard-update', {
            userId,
            score: finalScore,
            finishedAt: finalFinishedAt
        });

        console.log(`Score updated and emitted for user ${userId}. New Score: ${finalScore}`);
    } catch (error) {
        console.error(`Failed to update score for user ${userId}:`, error);
    }
}

module.exports = {
    handleScoreUpdate
};
