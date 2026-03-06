  const validator=require('validator');
async function validateProblem(req,res,next){
    try{
        const {
            title,
            description,
            difficulty,
            tags,
            BoilerPlate,
            ReffSolution,
            visibleTestCases,
            invisibleTestCases,
            topics,
            hints,
            similarquestions,
            discussion,
            solutions,
            companies,
            accepted,
            totalSubmissions,
            acceptanceRate
        }=req.body;
        const updates={

        };
         if (title !== undefined) {
    if (typeof title !== "string" || !validator.isLength(title, { min: 1, max: 100 })) {
      return res.status(400).json({ message: "Invalid title" });
    }
    updates.title = title;
  }

  if (description !== undefined) {
    if (typeof description !== "string" || !validator.isLength(description, { min: 1, max: 2000 })) {
      return res.status(400).json({ message: "Invalid description" });
    }
    updates.description = description;
  }

  if (difficulty !== undefined) {
    const allowed = ["Easy", "Medium", "Hard"];
    if (!allowed.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty" });
    }
    updates.difficulty = difficulty;
  }


  const validateStringArray = (arr, fieldName) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return `${fieldName} must be a non-empty array`;
    }
    if (!arr.every(item => typeof item === "string" && item.length > 0)) {
      return `Each ${fieldName} item must be a non-empty string`;
    }
    return null;
  };

  if (tags !== undefined) {
    const err = validateStringArray(tags, "tags");
    if (err) return res.status(400).json({ message: err });
    updates.tags = tags;
  }

  if (topics !== undefined) {
    const err = validateStringArray(topics, "topics");
    if (err) return res.status(400).json({ message: err });
    updates.topics = topics;
  }

  if (hints !== undefined) {
    const err = validateStringArray(hints, "hints");
    if (err) return res.status(400).json({ message: err });
    updates.hints = hints;
  }

  if (companies !== undefined) {
    const err = validateStringArray(companies, "companies");
    if (err) return res.status(400).json({ message: err });
    updates.companies = companies;
  }




  if (BoilerPlate !== undefined) {
    if (!Array.isArray(BoilerPlate) || BoilerPlate.length === 0) {
      return res.status(400).json({ message: "BoilerPlate must be a non-empty array" });
    }

    for (let item of BoilerPlate) {
      if (
        typeof item.language !== "string" ||
        typeof item.Boilercode !== "string"
      ) {
        return res.status(400).json({ message: "Invalid BoilerPlate format" });
      }
    }

    updates.BoilerPlate = BoilerPlate;
  }

  if (ReffSolution !== undefined) {
    if (!Array.isArray(ReffSolution) || ReffSolution.length === 0) {
      return res.status(400).json({ message: "ReffSolution must be a non-empty array" });
    }

    for (let item of ReffSolution) {
      if (
        typeof item.language !== "string" ||
        typeof item.Fullcode !== "string"
      ) {
        return res.status(400).json({ message: "Invalid ReffSolution format" });
      }
    }

    updates.ReffSolution = ReffSolution;
  }


  const validateTestCases = (arr, invisible = false) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;

    for (let item of arr) {
      console.log( typeof item);
      if (typeof item !== "object")
        return false;
    }

    return true;
  };

  if (visibleTestCases !== undefined) {
    if (!validateTestCases(visibleTestCases)) {
      return res.status(400).json({ message: "Invalid visibleTestCases format" });
    }
    updates.visibleTestCases = visibleTestCases;
  }

  if (invisibleTestCases !== undefined) {
    if (!validateTestCases(invisibleTestCases, true)) {
      return res.status(400).json({ message: "Invalid invisibleTestCases format" });
    }
    updates.invisibleTestCases = invisibleTestCases;
  }


  if (similarquestions !== undefined) {
    if (
      !Array.isArray(similarquestions) ||
      !similarquestions.every(id => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).json({ message: "Invalid similarquestions IDs" });
    }
    updates.similarquestions = similarquestions;
  }

  

  const validateNumber = (num, field) => {
    if (typeof num !== "number" || num < 0) {
      return `${field} must be a positive number`;
    }
    return null;
  };

  if (accepted !== undefined) {
    const err = validateNumber(accepted, "accepted");
    if (err) return res.status(400).json({ message: err });
    updates.accepted = accepted;
  }

  if (totalSubmissions !== undefined) {
    const err = validateNumber(totalSubmissions, "totalSubmissions");
    if (err) return res.status(400).json({ message: err });
    updates.totalSubmissions = totalSubmissions;
  }

  if (acceptanceRate !== undefined) {
    const err = validateNumber(acceptanceRate, "acceptanceRate");
    if (err) return res.status(400).json({ message: err });
    updates.acceptanceRate = acceptanceRate;
  }


  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid updates provided" });
  }

  req.updates = updates;
    next();

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({ message: 'Error validating problem', error });
    }
}

async function updateProblem(req,res,next) {
    try{
        const {
            title,
            description,
            difficulty,
            tags,
            BoilerPlate,
            ReffSolution,
            visibleTestCases,
            invisibleTestCases,
            topics,
            hints,
            similarquestions,
            discussion,
            solutions,
            companies,
            accepted,
            totalSubmissions,
            acceptanceRate
        }=req.body;
        const updates={};
        if(title){
            if(!validator.isLength(title,{min:1,max:100})){
                return res.status(400).json({ message: 'Title is required' });
            }
            updates.title=title;
        }
        if(description){
            if(!validator.isLength(description,{min:1,max:1000})){
                return res.status(400).json({ message: 'Description is required' });
            }
            updates.description=description;
        }
        if(difficulty){
            if(!validator.isLength(difficulty,{min:1,max:100})){
                return res.status(400).json({ message: 'Difficulty is required' });
            }
            updates.difficulty=difficulty;
        }
        if(tags){
            if(!validator.isLength(tags,{min:1,max:100})){
                return res.status(400).json({ message: 'Tags is required' });
            }
            updates.tags=tags;
        }
        if(BoilerPlate){
            if(!validator.isLength(BoilerPlate,{min:1,max:100})){
                return res.status(400).json({ message: 'BoilerPlate is required' });
            }
            updates.BoilerPlate=BoilerPlate;
        }
        if(ReffSolution){
            if(!validator.isLength(ReffSolution,{min:1,max:100})){
                return res.status(400).json({ message: 'ReffSolution is required' });
            }
            updates.ReffSolution=ReffSolution;
        }
        if(visibleTestCases){
            if(!validator.isLength(visibleTestCases,{min:1,max:100})){
                return res.status(400).json({ message: 'VisibleTestCases is required' });
            }
            updates.visibleTestCases=visibleTestCases;
        }
        if(invisibleTestCases){
            if(!validator.isLength(invisibleTestCases,{min:1,max:100})){
                return res.status(400).json({ message: 'InvisibleTestCases is required' });
            }
            updates.invisibleTestCases=invisibleTestCases;
        }
        if(topics){
            if(!validator.isLength(topics,{min:1,max:100})){
                return res.status(400).json({ message: 'Topics is required' });
            }
            updates.topics=topics;
        }
        if(hints){
            if(!validator.isLength(hints,{min:1,max:100})){
                return res.status(400).json({ message: 'Hints is required' });
            }
            updates.hints=hints;
        }
        if(similarquestions){
            if(!validator.isLength(similarquestions,{min:1,max:100})){
                return res.status(400).json({ message: 'Similarquestions is required' });
            }
            updates.similarquestions=similarquestions;
        }
        if(discussion){
            if(!validator.isLength(discussion,{min:1,max:100})){
                return res.status(400).json({ message: 'Discussion is required' });
            }
            updates.discussion=discussion;
        }
        if(solutions){
            if(!validator.isLength(solutions,{min:1,max:100})){
                return res.status(400).json({ message: 'Solutions is required' });
            }
            updates.solutions=solutions;
        }
        if(companies){
            if(!validator.isLength(companies,{min:1,max:100})){
                return res.status(400).json({ message: 'Companies is required' });
            }
            updates.companies=companies;
        }
        if(accepted){
            if(!validator.isLength(accepted,{min:1,max:100})){
                return res.status(400).json({ message: 'Accepted is required' });
            }
            updates.accepted=accepted;
        }
        if(totalSubmissions){
            if(!validator.isLength(totalSubmissions,{min:1,max:100})){
                return res.status(400).json({ message: 'TotalSubmissions is required' });
            }
            updates.totalSubmissions=totalSubmissions;
        }
        if(acceptanceRate){
            if(!validator.isLength(acceptanceRate,{min:1,max:100})){
                return res.status(400).json({ message: 'AcceptanceRate is required' });
            }
            updates.acceptanceRate=acceptanceRate;
        }
        if(Object.keys(updates).length===0){
            return res.status(400).json({ message: 'No updates provided' });
        }
        req.updates=updates;
        next(); 
    }
    catch(error){

        return res.status(500).json({ message: 'Error validating problem', error });
    }
}

module.exports={
    validateProblem,
    updateProblem
};