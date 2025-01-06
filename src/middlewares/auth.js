const User=require("../models/user");
const jwt=require("jsonwebtoken");



const userAuth=async (req,res,next)=>{
    
    try{
        const cookies=req.cookies;

    const {token}=cookies;

    if(!token){
        throw new Error("Token is invalid!!!");
    }

    const decodedObj= await jwt.verify(token,process.env.JWT_TOKEN);

    const {_id}=decodedObj;

    const user=await User.findById(_id);

    if(!user){
        throw new Error("User doesn't Exist!");
    }

    req.user=user;

    next();
    }catch(err){
        res.status(400).send("Some Error Occurred!!"+err.message);
    }
}

module.exports={userAuth}