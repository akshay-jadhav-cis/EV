const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "/login",
  }),
  async (req, res) => {
    const user = req.user;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      hasvehicle: user.hasvehicle ?? "no",
    };

    res.redirect(process.env.CLIENT_URL); 
  }
);
router.get("/login/success", (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user,
    });
  }
  res.json({ loggedIn: false });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});


module.exports = router;
