const mongoose=require('mongoose');

const problemSchema=new mongoose.Schema({
   title: { type: String ,required: true},
  
    BoilerPlate:[
     {
        language: { type: String, required: true },
        Boilercode: { type: String, required: true }
     }
    ],
    ReffSolution:[
        {
           language: { type: String, required: true },
           Fullcode: { type: String, required: true }
        }
     ],
    complexity: {
        time: { type: String },
        space: { type: String }
    },
    description:{
        type:String,
        required:true
    },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: { type: [String], index: true, default: [] }, 
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    visibleTestCases:[
        {input:{
            type:String,
            required:true
        },
    
        output:{
            type:String,
            required: true 
        },
        explanation:{
            type:String,
            required: true 
        }
    }
    ],
    invisibleTestCases:[
        {input:{
            type:String,
            required:true
        },
    
        output:{
            type:String,
            required: true 
        }
    }
    ],
    topics: [
        {
            type: String,
            required: true
        }
    ],
    hints: [
        {
            type: String, 
            required: true
        }
    ],
    similarquestions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Problems'
        }
    ],
    discussion: [
        {
              user: { type: Schema.Types.ObjectId, ref: 'User' },
              comment: { type: String, required: true },
              createdAt: { type: Date, default: Date.now }
        }
    ],
    solutions: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            code: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    companies:[
        {
            type:String,
            required:true
        }
    ],
    
    accepted:{
        type:Number,
        default:0
    },
    totalSubmissions:{
        type:Number,
        default:0
    },
    acceptanceRate:{
        type:Number,
        default:0
    }
    
});


const problemModel=mongoose.model('Problem',problemSchema);

module.exports=problemModel;