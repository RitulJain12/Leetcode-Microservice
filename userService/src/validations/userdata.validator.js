const validator=require('validator');

function validateUserData(req,res,next){
    const {name,email,password}=req.body;
  //  if(!name) return res.status(404).json({message:"name is Not found"});
    if(!email || !validator.isEmail(email)){
        return res.status(400).json({message:'Invalid email'});
    }
    if(!password || !validator.isStrongPassword(password,{minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:0})){
        return res.status(400).json({message:'Use valid and strong password'});
    }
    next(); 
}

module.exports={
    validateUserData
}