const express=require("express");
const userRoute=express.Router();
const User=require("../models/User");
const{hashPassword,hashCompare}=require("../utils/Password");
const wrapAsync = require("../utils/wrapAsync");
userRoute.post("/signup", wrapAsync(async (req, res) => {
  
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
 
}));
userRoute.post("/login",wrapAsync (async (req, res) => {
 
    const { user } = req.body;
    const findUser = await User.findOne({ name: user.name });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const checkPassword = await hashCompare(user.password, findUser.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Password mismatch" });
    }
    
      req.session.user = {
    id: findUser._id,
    name: findUser.name,
    location: findUser.location,
    hasvehicle: findUser.hasvehicle,
  };
    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });
 
}));
// in userRoute.js
userRoute.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

userRoute.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports=userRoute;