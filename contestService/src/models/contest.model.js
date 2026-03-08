const mongoose = require('mongoose');


const contestSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    contesturl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://ik.imagekit.io/rituls12/contest'
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        points: {
            type: Number,
            required: true
        },
        penalty: {
            type: Number,
            required: true
        }
    }],
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'ended'],
        default: 'upcoming'
    },
    contestTotalPoints: {
        type: Number,
        required: true
    },
    users: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
            },
            score: {
                type: Number,
                default: 0
            },
            rank: {
                type: Number,
                default: 0
            },
            finishedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],



}, { timestamps: true });

const contestModel = mongoose.model('Contest', contestSchema);


module.exports = contestModel;