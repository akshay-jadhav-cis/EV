const mongoose=require("mongoose");
const express=require("express");
const userRoute=express.Router();
const User=require("../models/User");
const{hashPassword,hashCompare}=require("../utils/Password");
userRoute.post("/signup", async (req, res) => {
  try {
    const { user } = req.body;

    let hasvehicle = "no";
    if (typeof user.hasvehicle === "string" && (user.hasvehicle === "yes" || user.hasvehicle === "no")) {
      hasvehicle = user.hasvehicle;
    }

    const newUser = new User({
      name: user.name,
      password: await hashPassword(user.password),
      location: user.location,
      mobilenumber: String(user.mobilenumber),
      hasvehicle: hasvehicle,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User signed up successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});
userRoute.post("/login", async (req, res) => {
  try {
    const { user } = req.body;
    const findUser = await User.findOne({ name: user.name });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const checkPassword = await hashCompare(user.password, findUser.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Password mismatch" });
    }
    res.json({
      success: true,
      message: "Login successful",
      user: {
        name: findUser.name,
        location: findUser.location,
        hasvehicle: findUser.hasvehicle,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports=userRoute;