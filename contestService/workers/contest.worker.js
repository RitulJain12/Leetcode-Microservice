const { Worker } = require('bullmq');
const contestModel = require('../models/contest.model');
const broker = require('../services/broker');
const { connection } = require('../config/queue.config');
const evaluationService = require('../services/evaluation.service');
const axios = require('axios');

const contestWorker = new Worker('contest-queue', async (job) => {
    const { contestId } = job.data;
    console.log(`Processing job ${job.name} for contest ${contestId}`);

    try {
        const contest = await contestModel.findById(contestId);
        if (!contest) {
            console.error(`Contest ${contestId} not found`);
            return;
        }

        if (job.name === 'contest-start') {
            contest.status = 'ongoing';
          
         
    
           await contest.save();
            await broker.publishToQueue('CONTEST_UPDATES', JSON.stringify({
                type: 'CONTEST_START',
                contestId: contest._id,
                name: contest.name
            }));

            console.log(`Contest ${contest.name} started`);
        } else if (job.name === 'contest-end') {
            contest.status = 'ended';
            await contest.save();

            
             await evaluationService.evaluateContest(contestId);

            
            await broker.publishToQueue('CONTEST_UPDATES', JSON.stringify({
                type: 'CONTEST_END',
                contestId: contest._id,
                name: contest.name
            }));

            console.log(`Contest ${contest.name} ended and evaluation triggered`);
        }
    } catch (error) {
        console.error(`Error processing job ${job.name}:`, error);
        throw error; 
    }
}, { connection });

contestWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});

contestWorker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = contestWorker;
