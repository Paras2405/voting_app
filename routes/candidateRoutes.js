const express=require('express')
const candidate = require('../models/candidates');
const router=express.Router()
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
const User = require('../models/user');
const Candidate = require('../models/candidates');

const checkAdminRole= async (userID)=>{
try{
const user=await User.findById(userID);
  return user.role==="admin";
}
catch(err){
return false;
}
}

//post route to add a candidate

router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{

        if(! await checkAdminRole(req.user.id)){
return res.status(403).json({message:'user has not admin role'})
        }
        const data=req.body//assuming the request body contains candidate data
    const newCandidate= new Candidate(data);//create a new candidate document using mongoose model

    const response=await newCandidate.save()//here saving new user's data is asynchronous 
    console.log('data saved')


    res.status(200).json({response:response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }


})

router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
   
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user has not admin role'})
                    }
   
                    const candidateID=req.params.candidateID;//Extract the id from Url Parameter
                    const updatedCandidateData=req.body;//Updated data for the candidate
                    
                    const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
                        new:true,//Return updated Document
                        runValidators:true//Run Mongoose Validation
                    })
                    
                    if(!response){
                      return  res.status(403).json({error:'Candidate not found'})
                    }
                    console.log('data updated')
                    res.status(200).json(response)
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).json({error:'Internal Server error'})
                    }
                    })

                
router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
                    try{
                        const candidateID=req.params.candidateID;//Extract the id from Url Parameter
                        const response=await Candidate.findByIdAndDelete(candidateID);
                        if(!response){
                            return  res.status(403).json({error:'candidate not found'})
                        }
                        console.log(' candidate data deleted');
                        res.status(200).json({message:'candidate-id deleted successfully'});
                    }
                    catch(err){
                        console.log(err)
                        res.status(500).json({error:'Internal server error'})
                    }
                })

//let's start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
//no admin vote
//user can vote only once
const candidateID= req.params.candidateID;
const userID=req.user.id;

try{
//Find the candidate document with candidateid
const candidate= await Candidate.findById(candidateID);
const user = await User.findById(userID);

if(!candidate){
    return res.status(400).json({error:'candidate  not found'});
}
if(!user){
    return res.status(400).json({error:'user  not found'});
}
if(user.isVoted==true){
return  res.status(400).json({error:'User has  already voted'});
}
if(user.role==='admin'){
    return  res.status(400).json({error:'admin cannot vote'}); 
}
candidate.votes.push({user:userID});
candidate.voteCount++;
await candidate.save();

//update user document
user.isVoted=true;
await user.save();
res.status(200).json({message:'user voted successfully'});
}
catch(err){

    console.log(err)
    res.status(500).json({error:'Internal server error'})
}
})
//les calculate vote Count
router.get('/vote/count',async (req,res)=>{
    try{
    const candidate= await Candidate.find().sort({voteCount:'desc'});
    const record=candidate.map((data)=>{
      return{
        party:data.party,
        count:data.voteCount

      }
    })

    return res.status(200).json(record);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
    }
  

)
router.get('/list',async (req,res)=>{
    try{
        const candidate= await Candidate.find();
        const record=candidate.map((data)=>{
          return{
            party:data.party,
            name:data.name,
            age:data.age,

    
          }

    })
    return res.status(200).json(record);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
})




module.exports=router;