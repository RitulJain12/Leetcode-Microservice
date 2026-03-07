const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/user.middleware');
const submissionController = require('../controllers/submission.controller');
const validation = require('../validations/submission.validation');


//POST   /api/submission/submit/:id
router.post('/submit/:id', middleware.authMiddleware, validation.validateSubmission, submissionController.submit)

//POST /api/submission/run/:id
router.post('/run/:id', middleware.authMiddleware, validation.validateSubmission, submissionController.runProblem)

//GET /api/submission/get/:id
router.get('/get/:id', middleware.authMiddleware, submissionController.getSubmission)

//GET /api/submission/getall/:id
router.get('/getall/:id', middleware.authMiddleware, submissionController.getAllSubmission)
router.get('/status/:id', middleware.authMiddleware, submissionController.getSubmissionStatus)
router.get('/solved', middleware.authMiddleware, submissionController.getSolvedProblems)









module.exports = router;  