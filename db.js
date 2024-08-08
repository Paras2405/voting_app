const mongoose=require('mongoose')
require('dotenv').config();

//define mongoDB connection url

//const mongoURL=process.env.DBURL_LOCAL
const mongoURL=process.env.DBURL;
const PORT=process.env.PORT||3001;


mongoose.connect(mongoURL, {
    serverSelectionTimeoutMS: 30000
  // You can remove useNewUrlParser and useUnifiedTopology as they are no longer needed.
})
.then(() => console.log(`MongoDB connected at port ${PORT}`))
.catch(err => console.log('MongoDB connection error', err));

const db=mongoose.connection;
//db=>it is used to handle events and interact with the database
db.on('connected',()=>{
    console.log('Connected to the MongoDB server');
})
db.on('error',(err)=>{
    console.log('MongoDB connection error',err);
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected');
})
module.exports=db;//export db connection