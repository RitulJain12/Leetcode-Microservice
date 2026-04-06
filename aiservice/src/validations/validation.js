const validator=require('validator');

const createFAQValidation=(req,res,next)=>{
    try{
        const {question,answer,problemId}=req.body;
         console.log(req.body);
        if(!question || !answer || !problemId){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        if(!validator.isLength(question,{min:1,max:1000})){
            return res.status(400).json({success:false,message:"Question must be between 1 and 1000 characters"})
        }
        if(!validator.isLength(answer,{min:1,max:1000})){
            return res.status(400).json({success:false,message:"Answer must be between 1 and 1000 characters"})
        }
        if(!validator.isMongoId(problemId)){
            return res.status(400).json({success:false,message:"Invalid problem id"})
        }
        next();
    }
    catch(err){
        res.status(500).json({success:false,message:err.message})
    }
}

module.exports={createFAQValidation}
