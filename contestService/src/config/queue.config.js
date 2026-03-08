const Redis = require('ioredis');
const { Queue } = require('bullmq');

const redisOptions = {
    host: process.env.Redis_Host || 'localhost',
    port: process.env.Redis_port || 6379,
    password: process.env.Redis_pass,
    maxRetriesPerRequest: null, 
};

const connection = new Redis(redisOptions);

const contestQueue = new Queue('contest-queue', { connection });

module.exports = {
    contestQueue,
    connection
};
