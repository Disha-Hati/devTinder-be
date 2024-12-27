const express=require('express');
const requestRouter=express.Router();
const User=require("../models/user");
const connectionReq=require("../models/connectionRequest");

const {userAuth}=require("../middlewares/auth")


//SEND CONNECTION REQUEST
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        //extract the toUserId and fromUserId and status
         const fromUserId=req.user._id;
         const toUserId=req.params.toUserId;
         const status=req.params.status;
        //check if toUserId is valid and exists in our database

        const user=await User.findOne({_id:toUserId});
        if(!user){
            throw new Error("The User doesn't exist!!!");
        }
        //while sending the status can only be interested or ignored, check if our status is correct
        const ALLOWED_FIELDS=["interested","ignored"];

        if(!ALLOWED_FIELDS.includes(status)){
            throw new Error("You don't have priviledge to : "+status);
        }

        //Once a request has been sent from X to Y , another request will be invalid

        const existingConnection=await connectionReq.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        })

        if(existingConnection){
            throw new Error("The Connection Requests already exists!!");
        }

        //you should not send connection request to yourself
        if(fromUserId.equals(toUserId)){
            throw new Error("You cannot send connection request to yourself!!")
        }

    //create a new instance of connectionReq model
    const connectionrequest=new connectionReq({
        fromUserId,
        toUserId,
        status,
    })

    //save to db
    await connectionrequest.save();
    // send response
    res.json({
        message: req.user.firstName +"  "+ status+"  " + user.firstName,
    })
    }catch(err){
        res.status(400).send("Error sending request !! "+ err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const status=req.params.status;
        const requestId=req.params.requestId;
        const loggedInUser=req.user;

        const allowedStatus=["accepted","rejected"];

        const isValidStatus=allowedStatus.includes(status);

        if(!isValidStatus){
            throw new Error("The status "+status+" isn't valid");
        }

        const connectionRequest=await connectionReq.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        })

        if(!connectionRequest){
            throw new Error("The connection request isn't valid!!");
        }

        connectionRequest.status=status;

        const data=await connectionRequest.save();

        res.json({
            message:"Connection Request is "+ status,
            data:data,
        })
    }catch(err){
        res.status(400).send("Some Error Occurred! "+err.message);
    }
})





module.exports=requestRouter;