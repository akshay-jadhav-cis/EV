const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
    },
    mobilenumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    hasvehicle:{
        type:String,
        enum:["yes","no"]
    }
});
const User=new mongoose.model("user",userSchema);
module.exports=User;