const express = require("express");
const batteryRoute = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Battery = require("../models/Battery");
const { batteryValidation } = require("../utils/SchemaValidation");
const upload = multer({ dest: "uploads/" });
const wrapAsync=require("../utils/wrapAsync");
batteryRoute.get("/all", wrapAsync(async (req, res) => {
    const batteries = await Battery.find();
    res.json(batteries);
}));

batteryRoute.post("/add", upload.single("image"), wrapAsync(async (req, res) => {
  
    const { error } = batteryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

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
    res.status(201).json({ success: true, message: "Battery added successfully", battery: newBattery });
  
}));


batteryRoute.get("/:id/view", (async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid battery ID" });
    }
    const battery = await Battery.findById(id);
    if (!battery) {
      return res.status(404).json({ success: false, message: "Battery not found" });
    }
    res.json(battery);
  } catch (error) {
    console.error("Error fetching battery:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}));

batteryRoute.get("/:id/edit", wrapAsync(async (req, res) => {
  
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid battery ID" });
    }
    const battery = await Battery.findById(id);
    if (!battery) {
      return res.status(404).json({ success: false, message: "Battery not found" });
    }
    res.json(battery);
 
}));

batteryRoute.put("/:id/edit", upload.single("image"), wrapAsync(async (req, res) => {
  
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid battery ID" });
    }

    const { error } = batteryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updatedData = { ...req.body };
    if (req.file) updatedData.image = req.file.filename;

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
 
}));


batteryRoute.delete("/:id/delete",wrapAsync( async (req, res) => {
  
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid battery ID" });
    }

    const deletedBattery = await Battery.findByIdAndDelete(id);
    if (!deletedBattery) {
      return res.status(404).json({ success: false, message: "Battery not found" });
    }

    res.status(200).json({
      success: true,
      message: "Battery deleted successfully",
      battery: deletedBattery,
    });
  
}));

module.exports = batteryRoute;
