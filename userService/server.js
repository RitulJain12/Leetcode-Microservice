require('dotenv').config();
const app=require('./src/app');
const connectDb=require('./src/config/mongo');
const {client}=require('./src/config/redis');

connectDb();
client.connect().then(()=>{
    console.log("Connected to Redis");
}).catch((err)=>{
    console.log("Error connecting to Redis:", err);
});


const PORT=process.env.PORT;








app.listen(PORT,()=>{
    console.log(`userService is running on port ${PORT}`);
})