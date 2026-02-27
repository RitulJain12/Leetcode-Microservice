const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const problemRouter=require('./routes/problem.routes');
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());






app.use('/api/problems',problemRouter);





module.exports=app;