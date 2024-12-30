const validator=require("validator");

const validateSignUp=(req)=>{
    const {firstName,lastName,email,password}=req.body;

    if(!firstName||!lastName){
        throw new Error("Please Enter valid name!!");
    }
    if(!validator.isEmail(email)){
        throw new Error("Enter valid EmailID!!!");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password");
    }

}

const validateEditProfile=(req)=>{
    const updates=req.body;
    const ALLOWED_FIELDS=["firstName","lastName","age","photo","about","skills","gender"];

    const invalidFields=Object.keys(updates).filter((f)=>!ALLOWED_FIELDS.includes(f));

    if(invalidFields.length>0){
        throw new Error("You cannot edit:"+invalidFields.join(","));
        
    }
}

module.exports={validateSignUp,validateEditProfile};