const express=require('express');
const authRouter=express.Router();

const bcrypt=require("bcrypt"); //used for encrypting passwords

const User=require("../models/user");
const {validateSignUp}=require("../utils/validation");



//signup
authRouter.post("/signup",async (req,res)=>{
    
    try{
     const {firstName,lastName,email,password}=req.body;
    //validate the data
     validateSignUp(req);
    //encrypt the password
    //const hashedPassword=await user.hashPassword(password);
    const hashedPassword=await bcrypt.hash(password,10);
 
 
     //create instance of the User model using req.body
    const user=new User({firstName,
     lastName,
     email,
     password:hashedPassword});

    //save to DB
     await user.save();
    res.send("Data is successfully saved to DB");
    }catch(err){
     res.status(400).send("Error Saving the user"+err.message);
    }
 })

//login
authRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid Email!!");
        }

        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){

            //create a web token
            const token=await user.getJWT();

            //add the token to cookie
            res.cookie("token",token);

            res.json({
                message:"You have logged in successfully!!!",
                data: user,
            })
        }else{
            throw new Error("Invalid Password");
        }
    }catch(err){
        res.status(400).send("Error Logging in:"+err.message);
    }
})

//logout
authRouter.post("/logout",async(req,res)=>{
    try{
        res.clearCookie('token')
        res.send("Logged Out Successfully!!");
    }catch(err){
        res.status(400).send("Error Logging Out!!"+err.message);
    }
})



module.exports=authRouter;