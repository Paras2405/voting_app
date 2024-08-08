const mongoose=require('mongoose')
const schema =mongoose.Schema;
//Define user schema
const bcrypt=require('bcrypt')

const userSchema=new schema(//schema types
    {
        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        mobile:{
          type:String,
        },
        email:{
            type:String,
        },
        address:{
            type:String,
            required:true
        },
        aadharCardNumber:{
            type:Number,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:['voter','admin'],
            default:'voter',

        },
        isVoted:{
        type:Boolean,
       default:false,
        }
       
        
        
      
    }
);
userSchema.pre('save',async function(next){
    const user=this;
    //Hash the password only if it is modified or new
    if(!user.isModified('password')) return next();
    try{
        //Hash password generation
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(user.password,salt);
        userSchema.password=hashedPassword;
        next();//it tells that i haved executed my part to mongoose
    }
catch(err){
return next(err)
}
})
userSchema.methods.comparePassword=async function(candidatePassword){
    try{
//Use bcrypt to compare the provided password with the Hashed password

const isMatch=await bcrypt.compare(candidatePassword,this.password)
    }
    catch(err){
        throw err;
    }
}
const user=mongoose.model('user',userSchema);
module.exports=user;