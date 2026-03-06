const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require('./routes/user.routes');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());




app.use('/api/users', userRouter);







module.exports = app;