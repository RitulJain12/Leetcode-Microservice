require('dotenv').config();
const app=require('./src/app');
const connectDb=require('./src/config/mongo');


connectDb();


const PORT=process.env.PORT;








app.listen(PORT,()=>{
    console.log(`submissionService is running on port ${PORT}`);
})