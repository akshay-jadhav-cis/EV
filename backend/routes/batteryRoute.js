const express = require("express");
const batteryRoute = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Battery = require("../models/Battery");
const { batteryValidation } = require("../utils/SchemaValidation");
const upload = multer({ dest: "uploads/" });
const wrapAsync=require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/Valid");
const User=require("../models/User");
batteryRoute.get("/all",wrapAsync(async (req, res) => {
    const batteries = await Battery.find();
    res.json(batteries);
}));

batteryRoute.post(
  "/add",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { error } = batteryValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { batteryname, voltage, batteryWeight, batteryType, sized } = req.body;

    // ✅ new battery linked to logged-in user
    const newBattery = new Battery({
      batteryname,
      voltage,
      batteryWeight,
      batteryType,
      sized,
      image: req.file ? req.file.filename : null,
      owner: req.session.user.id, 
    });

    await newBattery.save();

    res.status(201).json({
      success: true,
      message: "Battery added successfully",
      battery: newBattery,
    });
  })
);




batteryRoute.get("/:id/view", isLoggedIn,(async (req, res) => {
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

batteryRoute.get("/:id/edit", isLoggedIn,wrapAsync(async (req, res) => {
  
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

batteryRoute.put("/:id/edit", isLoggedIn, upload.single("image"), wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid battery ID" });
  }

  const battery = await Battery.findById(id);
  if (!battery) {
    return res.status(404).json({ success: false, message: "Battery not found" });
  }

  if (battery.owner.toString() !== req.session.user.id) {
    return res.status(403).json({ success: false, message: "You are not authorized to edit this battery." });
  }

  const updatedData = { ...req.body };
  if (req.file) updatedData.image = req.file.filename;

  const updatedBattery = await Battery.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Battery updated successfully",
    battery: updatedBattery,
  });
}));

batteryRoute.delete("/:id/delete", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid battery ID" });
  }

  const battery = await Battery.findById(id);
  if (!battery) {
    return res.status(404).json({ success: false, message: "Battery not found" });
  }

  // ✅ Ownership check
  if (battery.owner.toString() !== req.session.user.id) {
    return res.status(403).json({ success: false, message: "You are not authorized to delete this battery." });
  }

  await Battery.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Battery deleted successfully" });
}));


module.exports = batteryRoute;
