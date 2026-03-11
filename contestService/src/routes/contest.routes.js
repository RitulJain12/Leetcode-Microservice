const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/user.middleware');
const {contestValidation} = require('../validations/contest.validation');
const contestController = require('../controllers/contest.controller');
const leaderboardController = require('../controllers/leaderboard.controller');

// POST /api/contests/createcontest
router.post('/createcontest', contestValidation, contestController.createcontest);

// POST /api/contests/updatecontest/:contestId
router.post('/updatecontest/:contestId', adminMiddleware, contestValidation, contestController.updatecontest)

// DELETE /api/contests/deletecontest/:contestId
router.delete('/deletecontest/:contestId', adminMiddleware, contestController.deletecontest);

// POST /api/contests/getcontest
router.post('/getcontest', authMiddleware, contestController.getcontest);

// Public/read APIs for frontend
// GET /api/contests        -> list all contests (paginated support handled in controller)
router.get('/', authMiddleware, contestController.getallcontests);
// GET /api/contests/:contestId -> single contest by id
router.get('/:contestId', authMiddleware, contestController.getcontest);
// GET /api/contests/:contestId/leaderboard -> redis-backed leaderboard
router.get('/:contestId/leaderboard', authMiddleware, leaderboardController.getLeaderboard);

// POST /api/contests/registerforcontest/:id
router.post('/registerforcontest/:id', authMiddleware, contestController.registerforcontest);

// POST /api/contests/unregisterforcontest/:id
router.post('/unregisterforcontest/:id', authMiddleware, contestController.deregistration);

// GET  /api/contests/checkregistration
router.get('/checkregistration', authMiddleware, contestController.checkregistration);

module.exports = router;  