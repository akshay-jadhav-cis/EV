const express=require('express');
const batteryRoute=express.Router();
const multer=require("multer");
const Battery=require("../models/Battery")
const upload = multer({ dest: "uploads/" });
const mongoose=require("mongoose")
batteryRoute.get("/all", async (req, res) => {
    let batteries = await Battery.find();
    res.json(batteries);
})
batteryRoute.post("/add", upload.single("image"), async (req, res) => {

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
batteryRoute.get("/:id/view", async (req, res) => {
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
        console.log("Error occured during the View Page addition = ",error);
        res.status(404).json({error:"Error "});
    }
});
batteryRoute.get("/:id/edit",async(req,res)=>{
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
batteryRoute.put("/:id/edit", upload.single("image"), async (req, res) => {
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
batteryRoute.delete("/:id/delete",async(req,res)=>{
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
module.exports=batteryRoute;