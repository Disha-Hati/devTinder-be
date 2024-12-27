const express=require('express');
const userRouter=express.Router();
const User=require("../models/user");
const connectionReq=require("../models/connectionRequest");
const {userAuth}=require("../middlewares/auth");
const { Connection } = require('mongoose');




//pending connection request for loggedInUser
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const listOfReq=await connectionReq.find({status:"interested",toUserId:loggedInUser._id}).populate("fromUserId",["firstName","lastName","photo"]);

        res.json({
            message:"Pending Connection Requests are fetched successfully!! Total No of Pending Connection Requests: "+listOfReq.length,
            data:listOfReq,
        })

    }catch(err){
        res.status(400).send("Some error occurred! "+err.message);
    }
})

//List of Connection Requests (I've accepted)
userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connections=await connectionReq.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        })
        .populate("fromUserId",["firstName","lastName","gender","age","photo"])
        .populate("toUserId",["firstName","lastName","gender","age","photo"])

        const data=connections.map((key)=>{
            if(key.fromUserId._id.toString()===loggedInUser._id.toString()){
                return key.toUserId;
            }
            return key.fromUserId;
        });

        res.json({message:"Fetched your Connections Successfully!!",
            data:data,
        })


    }catch(err){
        res.status(400).send("Some Error Occurred!!"+err.message);
    }
})

//User feed (Pagination added)
userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;

        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;

        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        const interactedUserIds= await connectionReq.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ],
            
        })

        const excludeUserIds = new Set();
        interactedUserIds.forEach((req) => {
          excludeUserIds.add(req.fromUserId.toString());
          excludeUserIds.add(req.toUserId.toString());
        });
    
        // Add logged-in user's ID to the exclusion list
        excludeUserIds.add(loggedInUser._id.toString());

        const feed = await User.find({
            _id: { $nin: Array.from(excludeUserIds) }, // Convert Set to Array
          }).select("firstName lastName gender age about skills").skip(skip).limit(limit);

        res.json({message:"Your message data is fetched successfully!!",
            data:feed,
        })
    }catch(err){
        res.status(400).send("Some error Occurred!! "+err.message);
    }
})

module.exports=userRouter;