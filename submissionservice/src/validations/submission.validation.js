const validator=require('validator');
 const languageCode={
        "c++": 54,
        "java": 62,
      "javascript": 63,
       "python": 92 ,
       "kotlin":78  ,
       "c":50 ,
       "c#": 51,
        "php":98 ,
        "cpp":54,
    }

async function validateSubmission(req,res,next){
    try{
        const {code,language}=req.body;
        const problemId=req.params.id;
        if(!validator.isMongoId(problemId)){
            return res.status(400).json({message:"Invalid problem ID"});
        }
        if(!code || !language){
            return res.status(400).json({message:"Code and language are required"});
        }
        if(!validator.isIn(language,["c++","cpp", "java", "python", "javascript", "c","Kotlin","c#"])){
            return res.status(400).json({message:"Invalid language"});
        }
        req.languageId=languageCode[language.toLowerCase()];
        req.problemId=problemId;
        req.code=code;
        req.language=language;
        console.log(`req.languageId`,req.languageId)
      next();
    }catch(err){
        return res.status(500).json({message:"Internal server error"});
    }
}


module.exports={validateSubmission}