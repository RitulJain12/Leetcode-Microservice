const validator=require('validator');


async function  profileUpdateMiddleware( req,res,next) {
 

  const {
    name,
    profilepicture,
    githubLink,
    linkedinLink,
    twitterLink,
    personalWebsite
  } = req.body;

  const updates = {};


  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      !validator.isLength(name.trim(), { min: 2, max: 50 })
    ) {
      return res.status(400).json({
        message: "Name must be 2-50 characters"
      });
    }

    updates.name = name.trim();
  }

  
  if (profilepicture !== undefined) {
    if (
      typeof profilepicture !== "string" ||
      !validator.isURL(profilepicture)
    ) {
      return res.status(400).json({
        message: "Profile picture must be valid URL"
      });
    }

    updates.profilepicture = profilepicture;
  }


  if (githubLink !== undefined) {
    if (
      typeof githubLink !== "string" ||
      !validator.isURL(githubLink)
    ) {
      return res.status(400).json({
        message: "Invalid GitHub URL"
      });
    }

    updates.githubLink = githubLink;
  }
  
  if(Object.keys(updates).length===0){
    return res.status(400).json({
      message:"Nothing is Provided for update"
    })
  }

 else  next();

};



module.exports={
    profileUpdateMiddleware
}