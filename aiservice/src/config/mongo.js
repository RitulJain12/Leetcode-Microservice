const  mongoose=require('mongoose')

async function  Connect(){
try {
      await  mongoose.connect(process.env.Mongo_uri);
       console.log("Connected Succesfully");
 }
 catch(err){
    console.log(err)
 }
};
module.exports=Connect;