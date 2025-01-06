const express=require("express");

const app=express();
const cookieParser=require("cookie-parser");
const cors=require("cors");
require('dotenv').config()

const connectDB=require("./config/database");

app.use(cors(
    {
    origin: "http://localhost:5173", // Set the correct origin
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH' ], // Allow required HTTP methods
    }
)); //middleware for cors

app.use(express.json()); //middleware
app.use(cookieParser()); //middleware


const authRouter=require('./routes/authR');
const profileRouter=require('./routes/profileR');
const requestRouter=require('./routes/ConnectionRequestR');
const userRouter=require('./routes/userR');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
 
connectDB().then(()=>{
    console.log("DB connected successfully");
    app.listen(process.env.PORT,()=>{
        console.log("We're finally doing it!!");
    })
})
.catch((err)=>{
    console.log("Not connected!!");
})

