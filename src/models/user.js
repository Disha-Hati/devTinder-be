const mongoose= require('mongoose');
const validator=require("validator");
const jwt=require('jsonwebtoken');
const bcrypt=require("bcrypt");


//new Schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },   
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not Strong Password");
            }
        }
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
				throw new Error("Gender data is not valid!");
			}
        }
    },
    age:{
        type:Number,
        min:18,
    },
    photo:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    about:{
        type:String,
        default:"This is the default Bio",
        trim:true,
    },
    skills:{
        type:[String],
    }
},
{
    timestamps:true
})

userSchema.methods.getJWT=async function(){
    const user=this;

    const token=await jwt.sign({_id:user._id},"Dev@Tinder",{expiresIn:"1d"});

    return token;
}

// userSchema.methods.hashPassword=async function(passwordEnteredByUser) {
//     const user=this;
//     const hashedPassword=await bcrypt.hash(passwordEnteredByUser,10);
//     return hashedPassword;
// }

userSchema.methods.validatePassword=async function(passWordInput){
    const user=this;
    const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(passWordInput,passwordHash);

    return isPasswordValid;
}
//new model out of schema
const UserModel=mongoose.model("User",userSchema);

module.exports=UserModel;