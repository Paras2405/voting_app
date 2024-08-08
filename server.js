const express=require('express')//server imported from express library
const app=express()//app created
require('dotenv').config();
const db= require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());//body parser accepts data from user in all forms and converts data into json 

const PORT= process.env.PORT||3000;


const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');


app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})