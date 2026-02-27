
const msgqueue=require('../services/broker');
const profileModel=require('../models/profile.model');

async function createProfile(data) {

    try{
         console.log(`data is ${data}`)
        const {id,email,name}=data;
        const profile=await profileModel.create({
            user:id,
            email,
            name
        })
      
    }
    catch(err){
        console.log(`Error in Profile Creation :${err.message}`);
    }
    
}

async function getProfileById(req,res) {
    const {id}=req.params;
    if(!id) return res.status(400).json({message:"Id is not provided"});
    try{
         const profile=await profileModel.find({
            user:id,
         })
         if(!profile) return res.status(500).json({message:"Internal Server Error"});

         res.status(200).json({
            message:"Success",
            profile
         })
    }
    catch(err){

          console.log(`Error is:${err.message}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

async function updateProfile(req,res) {
  try{

    const {updates}=req;
    console.log(updates);
    const profile = await profileModel.findOneAndUpdate(
        { user: req.user.id },
        { $set: updates },
        { new: true }
      );
    
   return  res.json({
        success: true,
        data: profile
      });
  }

  catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal Server Error"});
  }

    
}




module.exports={
    createProfile,
    getProfileById,
    updateProfile
}