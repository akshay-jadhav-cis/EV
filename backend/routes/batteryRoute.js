const express = require("express");
const batteryRoute = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Battery = require("../models/Battery");
const { batteryValidation } = require("../utils/SchemaValidation");
const upload = multer({ dest: "uploads/" });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../utils/Valid");
const User = require("../models/User");

// GET ALL BATTERIES
batteryRoute.get("/all", wrapAsync(async (req, res) => {
  const batteries = await Battery.find();
  res.json(batteries);
}));

// ADD BATTERY
batteryRoute.post(
  "/add",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { error } = batteryValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { batteryname, voltage, batteryWeight, batteryType, sized } = req.body;

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
const user = await User.findById(req.session.user.id);
    user.batteries.push(newBattery._id);
    await user.save();

    res.status(201).json({ success: true, message: "Battery added", battery: newBattery });
  })
);

// VIEW BATTERY
batteryRoute.get("/:id/view", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  const battery = await Battery.findById(id);
  if (!battery) return res.status(404).json({ message: "Battery not found" });

  res.json(battery);
}));

// EDIT BATTERY
batteryRoute.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const battery = await Battery.findById(id);
  if (!battery) return res.status(404).json({ message: "Battery not found" });

  res.json(battery);
}));

batteryRoute.put("/:id/edit", isLoggedIn, upload.single("image"), wrapAsync(async (req, res) => {
  const { id } = req.params;

  const battery = await Battery.findById(id);
  if (!battery) return res.status(404).json({ message: "Battery not found" });

  if (battery.owner.toString() !== req.session.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  const updatedData = { ...req.body };
  if (req.file) updatedData.image = req.file.filename;

  const updatedBattery = await Battery.findByIdAndUpdate(id, updatedData, { new: true });

  res.json({ success: true, message: "Updated", battery: updatedBattery });
}));

// DELETE BATTERY
batteryRoute.delete("/:id/delete", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const battery = await Battery.findById(id);
  if (!battery) return res.status(404).json({ message: "Battery not found" });

  if (battery.owner.toString() !== req.session.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await Battery.findByIdAndDelete(id);
  res.json({ success: true, message: "Battery deleted" });
}));

module.exports = batteryRoute;
