//get one user
app.get("/user",async (req,res)=>{
    const userEmail=req.body.email; //extract
    
    try{
        const user=await User.find({email:userEmail});
        if(user.length===0){
            res.status(404).send("User not found!!");
        }else{
         res.send(user);
        }
    }catch(err){
        res.status(400).send("Something went wrong!!!")
    }
})


//feed
app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({});  //finds all users
        if(users.length===0){
            res.status(404).send("No Users!!");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong!!");
    }
})

//delete an user using id
app.delete("/user",async (req,res)=>{
    const userId=req.body.id;

    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("Deleted Successfully!!");
    }catch(err){
        res.status(400).send("Soemthing went wrong!!");
    }
})