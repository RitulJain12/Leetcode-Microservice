const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const contestRouter = require('./routes/contest.routes');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());






app.use('/api/contests', contestRouter);





module.exports = app;