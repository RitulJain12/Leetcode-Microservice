

async function createProblem(req,res){
    try{
        const {updates}=req.updates;
        const problem=await problemModel.create(updates);
        return res.status(201).json({ message: 'Problem created successfully', problem });
    }
    catch(error){
        return res.status(500).json({ message: 'Error creating problem', error });
    }
}


async function updateProblem(req,res) {
    try{
        const {updates}=req.updates;
        if(!req.params.id){
            return res.status(400).json({ message: 'Problem ID is required' });
        }
        const problem=await problemModel.findByIdAndUpdate(req.params.id,updates,{new:true});
        return res.status(200).json({ message: 'Problem updated successfully', problem });
    }
    catch(error){
        return res.status(500).json({ message: 'Error updating problem', error });
    }
}


async function deleteProblem(req,res) {
    try{
         if(!req.params.id){
            return res.status(400).json({ message: 'Problem ID is required' });
         }
        const problem=await problemModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Problem deleted successfully', problem });
    }
    catch(error){
        return res.status(500).json({ message: 'Error deleting problem', error });
    }
}

async function getProblem(req,res) {
    try{
        if(!req.params.id){
            return res.status(400).json({ message: 'Problem ID is required' });
        }
        const problem=await problemModel.findById(req.params.id);
        return res.status(200).json({ message: 'Problem fetched successfully', problem });
    }
    catch(error){
        return res.status(500).json({ message: 'Error fetching problem', error });
    }
}

async function getAllProblems(req,res) {
    try{
        const problems=await problemModel.find();
        return res.status(200).json({ message: 'Problems fetched successfully', problems });
    }
    catch(error){
        return res.status(500).json({ message: 'Error fetching problems', error });
    }
}


module.exports={
    createProblem,
    updateProblem,
    deleteProblem,
    getProblem,
    getAllProblems
};