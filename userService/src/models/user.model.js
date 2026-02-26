
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwtt=require('jsonwebtoken');
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        profile:{
            type:mongoose.Schema.Types.ObjectId,
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        role:{
            type:String,
            enum:['user','admin'],
            default:'user'
        },
        ispremium:{
            type:Boolean,
            default:false
        },
        premiumExpiresAt:{
            type:Date
        },

        },{timestamps:true}
);



userSchema.methods.jwt=(id,email)=>{
 const token=jwtt.sign({id,email},process.env.Jwt_key,{expiresIn:86400});
 return token;
}
userSchema.methods.compare=async(pass,password)=>{
 const issame= await bcrypt.compare(pass,password);
  return issame
}

userSchema.statics.hashpass=async(pass)=>{
  const hashpassw= await bcrypt.hash(pass,10);
  return hashpassw;
}

const UserModel=mongoose.model('User',userSchema);

module.exports=UserModel;