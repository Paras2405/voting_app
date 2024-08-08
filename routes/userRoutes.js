const express=require('express')
const user = require('./../models/user');
const router=express.Router()
const {jwtAuthMiddleware,generateToken}=require('./../jwt');



//signup endpoint

router.post('/signup',async(req,res)=>{
    try{
        const data=req.body//assuming the request body contains person data
    const newUser= new user(data);//create a new user document using mongoose model
     // Check if there is already an admin user
     const adminUser = await user.findOne({ role: 'admin' });
     if (data.role === 'admin' && adminUser) {
         return res.status(400).json({ error: 'Admin user already exists' });
     }

    const response=await newUser.save()//here saving new user's data is asynchronous 
    console.log('data saved')

const payload={
    id:response.id,
    
}
console.log(JSON.stringify(payload));

    const token=generateToken(payload)
    console.log('Token is:',token);
    res.status(200).json({response:response,token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }


})

//login endpoint

router.post('/login',async (req,res)=>{
    try{
//Extract aadharCardNumber and password from request body
const{ aadharCardNumber,password}=req.body;

//Find user by aadharCardNumber
const user=await user.findOne({aadharCardNumber:aadharCardNumber});

//if user does not exist or password does not match,return error
if(!user || (await user.comparePassword(password))){
    return res.status(401).json({error:'Invalid username or password'});
}
//generate token

const payload={
    id:response.id,
    
}
console.log(JSON.stringify(payload));

    const token=generateToken(payload)
    console.log('Token is:',token);
    res.status(200).json({response:response,token:token});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }
})


//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
const userdata= req.user
const userId=userdata.id;
const user= await user.findById(userId);
res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }
})




router.put('/profile/password',async(req,res)=>{
    try{
    const userId=req.user;//Extract the id from token
  const{currentPassword,newPassword}=req.body//Extract current and new password from request body
  const user= await user.findById(userId);

   

//if  password does not match,return error
if(!(await user.comparePassword(currentPassword))){
    return res.status(401).json({error:'Invalid username or password'});
}
//update user's password
user.password=newPassword;
await user.save();
    console.log('password updated')
    res.status(200).json({message:'password updated'})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'})
    }
    })
    
module.exports=router;