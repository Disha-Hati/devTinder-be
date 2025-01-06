const mongoose=require('mongoose');

const connectDB=async()=>{
    console.log(process.env.MONGO_CONNECTION_URL);
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    
};

module.exports=connectDB;



