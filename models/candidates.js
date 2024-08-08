const mongoose=require('mongoose')
const schema =mongoose.Schema;
//Define user schema
//const bcrypt=require('bcrypt')

const candidateSchema=new schema(//schema types
    {
        name:{
            type:String,
            required:true
        },
        party:{
        type:String,
        required:true,
        },
       age:{
        type:Number,
        required:true,
       },
       votes:[
        {
            user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            },
            votedAt:{
          type:Date,
          default:Date.now(),

            },

        }
       ],
       voteCount:{
          type:Number,
          default:0,
       }
        
        
      
    }
);

const candidate=mongoose.model('candidate',candidateSchema);
module.exports=candidate;