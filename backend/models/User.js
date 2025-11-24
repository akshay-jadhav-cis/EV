const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const userSchema=new Schema({
    googleId:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
    },
    mobilenumber:{
        type:Number,
       
    },
    password:{
        type:String,
        
    },
    hasvehicle:{
        type:String,
        enum:["yes","no"]
    },
    battery:[{
        type:Schema.Types.ObjectId,
        ref:"battery"
    }]
});
const User=new mongoose.model("user",userSchema);
module.exports=User;