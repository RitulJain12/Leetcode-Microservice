const { connection } = require('../config/queue.config');
const contestModel = require('../models/contest.model');

async function getLeaderboard(req, res) {
    const { contestId } = req.params;
    try {
        const redisKey = `leaderboard:${contestId}`;

    
        const rawResults = await connection.zrevrange(redisKey, 0, 99, 'WITHSCORES');

        const leaderboard = [];
        for (let i = 0; i < rawResults.length; i += 2) {
            const userId = rawResults[i];
            const compositeScore = parseFloat(rawResults[i + 1]);

        
            const points = Math.floor(compositeScore);

            leaderboard.push({
                userId,
                points,
                rank: (i / 2) + 1
            });
        }

        res.status(200).json({
            message: "Leaderboard fetched successfully",
            leaderboard
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getLeaderboard
};
