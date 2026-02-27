const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const profileRouter=require('./routes/profile.routes');
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());






app.use('/api/profiles',profileRouter);





module.exports=app;