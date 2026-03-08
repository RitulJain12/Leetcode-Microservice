require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/mongo');

const msgqueue = require('./src/services/broker');
require('./src/workers/contest.worker');

const scoreService = require('./src/services/score.service');

connectDb();

msgqueue.connect().then(() => {
    console.log("RabbitMQ Listener started for score updates");
    msgqueue.subscribetoQueue('CONTEST_SCORE_UPDATES', async (data) => {
        await scoreService.handleScoreUpdate(data);
    });
})



const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`contestService is running on port ${PORT}`);
})