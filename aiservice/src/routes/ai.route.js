const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middlewares/user.middleware");
const { createFAQValidation } = require("../validations/validation");
const aiController = require('../controllers/ai.controller')



// POST /api/aiservice/createFAQ
router.post("/createFAQ", adminMiddleware, createFAQValidation, aiController.createFAQ);

// POST /api/aiservice/faq/question/:id
router.post("/faq/question/:id", authMiddleware, aiController.question);

// GET /api/aiservice/create/contestquestion
router.get('/create/contestquestion', aiController.contestquestions);



module.exports = router;