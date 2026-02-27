require('dotenv').config();
const app=require('./src/app');
const connectDb=require('./src/config/mongo');
const {client}=require('./src/config/redis');
const msgqueue=require('./src/services/broker');
const profileController=require('./src/controllers/profile.controller')

connectDb();

msgqueue.connect().then(()=>{
    msgqueue.subscribetoQueue('Pofile-Creation',(data)=>{
       profileController.createProfile(data);
    })
})

client.connect().then(()=>{
    console.log("Connected to Redis");
}).catch((err)=>{
    console.log("Error connecting to Redis:", err);
});


const PORT=process.env.PORT;


    




app.listen(PORT,()=>{
    console.log(`profileService is running on port ${PORT}`);
})