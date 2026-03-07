const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  code: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    enum: ["c++", "cpp", "java", "python", "javascript", "c", "Kotlin", "c#"],
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "TLE", "Runtime Error", "Compilation Error", "Pending", "error"],
    default: "Pending",
  },
  time: {
    type: Number,
    default: 0,
  },
  memory: {
    type: Number,
    default: 0,
  },
  runtime: {
    type: Date,
    default: Date.now,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  testCasesPassed: {
    type: Number,
    default: 0,
  },
  totalTestCases: {
    type: Number,
    default: 0,
  },
  tokens: [
    {
      type: String,
    },
  ],
  testCaseResults: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      status: String,
      statusId: Number,
      time: Number,
      memory: Number,
      stderr: String,
      compile_output: String,
    }
  ]
},
  { timestamps: true }
);


const submissionModel = mongoose.model('Submission', submissionSchema);

module.exports = submissionModel;