require("dotenv").config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const PORT=process.env.PORT;
const methodOverride=require("method-override");
const Battery=require("./models/Battery");

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}
mongoose.set("strictQuery",true);
main().then(()=>{
    console.log("Database Connection Successfully");
}).catch((e)=>{
    console.error("Error occurred During the Database Connection");
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))

app.get("/",async(req,res)=>{
    let demo1=await Battery.find();
    res.json(demo1)
})
app.listen(PORT,(req,res)=>{
    console.log(`Port Is Listening At ${PORT}`);
});