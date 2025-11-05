require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT;
const methodOverride = require("method-override");
const Battery = require("./models/Battery");
const cors = require("cors");

const multer = require("multer");
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
mongoose.set("strictQuery", true);
main().then(() => {
    console.log("Database Connection Successfully");
}).catch((e) => {
    console.error("Error occurred During the Database Connection");
});
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({
    origin: "http://localhost:2000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.get("/batteries/all", async (req, res) => {
    let batteries = await Battery.find();
    res.json(batteries);
})
app.post("/batteries/add", upload.single("image"), async (req, res) => {

    try {
        const { batteryname, voltage, batteryWeight, batteryType, sized } = req.body;
        const newBattery = new Battery({
            batteryname,
            voltage,
            batteryWeight,
            batteryType,
            sized,
            image: req.file ? req.file.filename : null,
        });

        await newBattery.save();

        res.redirect("/batteries/all");
    } catch (error) {
        console.error("Error during battery add:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
})
app.get("/batteries/:id/view", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid battery ID" });
        }
        const findBattery = await Battery.findById(id);
        if (!findBattery) {
            return res.json("Battery NOt Found");
        }
        
        res.json(findBattery);
    } catch (error) {
        console.log("Error occured during the View Page addition");
        res.status(404).json({error:"Error "});
    }
});
app.get("/batteries/:id/edit",async(req,res)=>{
    try{
        const {id}=req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid battery ID" });
        }
        const findBattery=await Battery.findById(id);
        if (!findBattery) {
            return res.json("Battery NOt Found");
        }
        res.json(findBattery);
    }catch(e){
        console.log(e);
        res.json('Error Comes When updating the data')
    }
})
app.put("/batteries/:id/edit", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid battery ID" });
    }
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = req.file.filename;
    }
    const updatedBattery = await Battery.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBattery) {
      return res.status(404).json({ success: false, message: "Battery not found" });
    }
    res.status(200).json({
      success: true,
      message: "Battery updated successfully",
      battery: updatedBattery,
    });
  } catch (error) {
    console.error("Error during battery update:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.delete("/batteries/:id/delete",async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.json({success:false,message:'ID is not valid'})
        }
        const deleteBattery=await Battery.findByIdAndDelete(id); 
        if(!deleteBattery){
            return res.json({success:false,message:"Battery not Found"})
        }
        res.json({success:true,message:"Successfully Deleted the Battery",deleteBattery})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal Server Error "})
    }
})
app.listen(PORT, (req, res) => {
    console.log(`Port Is Listening At ${PORT}`);
});