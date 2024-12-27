const express=require('express');
const profileRouter=express.Router();

const bcrypt=require("bcrypt");

const {userAuth}=require("../middlewares/auth")
const {validateEditProfile}=require("../utils/validation")
const User=require("../models/user");

//Profile View
profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        res.send(user);

    }catch(err){
        res.status(400).send("Some Error Occurred"+err.message);
    }
})

//Profile Edit
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        validateEditProfile(req);

        const loggedInUser=req.user; //userAuth attaches 

        await User.findByIdAndUpdate({_id:loggedInUser._id},req.body,{runValidators:true});

        res.json({
            message:loggedInUser.firstName+" :Your User Profile is updated Successfully!!",
            data:loggedInUser,
        })
        //res.send(loggedInUser.firstName+" :Your User Profile is updated Successfully!!");
    }catch(err){
        res.status(400).send("Error updating Profile!!"+err.message);
    }
})

//Edit Password
profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        //extract current and new Password from req.body
        const {currentPassword,newPassword}=req.body;
        //check if user provided both fields
        if(!currentPassword||!newPassword){
            throw new Error("You need to enter both the fields!!");
        }
        //check if the current password actually matched with DB Password
        const user=req.user; //userAuth middleware
        const isPasswordValid=await user.validatePassword(currentPassword);
        if(!isPasswordValid){
            throw new Error("The current Password is incorrect!!")
        }
        //update the user.password to new Password and save
        const hashThePassword=await bcrypt.hash(newPassword,10);
        user.password=hashThePassword;
        await user.save();
        res.json({message:"Your Password has been updated successfully!!"})
        
    }catch(err){
        res.status(400).send("Error Editing the password!!"+err.message);
    }
})

module.exports=profileRouter;