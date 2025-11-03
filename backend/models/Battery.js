const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const batterySchema=new Schema({
    batteryname:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    voltage:{
        type:String,
        required:true
    },
    batteryType:{
        type:String,
        enum:["c-type","normal",'roll'],
        default:"normal",
        required:true
    },
    batteryWeight:{
        type:Number,
        required:true
    },
    sized:{
        type:String,
        enum:["small","large","medium"],
    }
},{timestamps:true});
const Battery=new mongoose.model("Battery",batterySchema);
module.exports=Battery;