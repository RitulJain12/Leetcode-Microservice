const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const submissionRouter = require('./routes/submission.router');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/submission', submissionRouter);








module.exports = app;