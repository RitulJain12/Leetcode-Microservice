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