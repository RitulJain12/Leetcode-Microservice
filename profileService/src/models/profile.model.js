const mongoose=require('mongoose');


const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true ,unique:true},
    email:{
        type:String,
    },
    name:{type:String,required:[true,'name is requires']},
    rank: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    contestsParticipated: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    badges: [{ type: String }],
    recentActivity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    ],
    profilepicture:{type:String,default :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFBknpLLS5SgmMyohrsOIcEgalakOorjGyXgQP0osIGOSTRLNsBkmNpwU&s"},
    totalsubmissions: { type: Number, default: 0 },
    totalactivedays: { type: Number, default: 0 },
    longeststreak: { type: Number, default: 0 },
    currentstreak: { type: Number, default: 0 },
    lastactive: { type: Date, default: Date.now },
    languagesUsed: [{ type: String }],
    topicsSolved: [{ type: String }],
     githubLink: { type: String },
     linkedinLink: { type: String },
    twitterLink: { type: String },
    personalWebsite: { type: String },
    strike:{
        type:Number,
        default:0
    }
}, { timestamps: true });






const profileModel= mongoose.model('Profile',profileSchema);

module.exports=profileModel;