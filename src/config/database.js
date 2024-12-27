const mongoose=require('mongoose');

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://dishahati55:mongodb55@devtindercluster.f5svd.mongodb.net/devTinder"
    )
};

module.exports=connectDB;



