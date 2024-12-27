const mongoose=require('mongoose');


const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:"Not a Valid Status!!"
        }
    }
},
{
    timestamps:true
})

const connectionRequestModel=mongoose.model("connectionReq",connectionRequestSchema);

module.exports=connectionRequestModel;