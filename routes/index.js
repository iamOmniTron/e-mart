const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");
const {
  signup,
  confirmation,
  logout,
} = require("../controllers/authController");
const path = require("path");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { hash } = require("../helpers");

router.get("/", (req, res) => {
  if (!req.user) return res.json("you have to login first");
  res.json({ user: req.user._id, success: req.flash("success") });
});

router.get("/login", (req, res) => {
  res.send(
    "<form action='/login' method='post'><div><input name='email' type='email' placeholder='email'/></div><div><input name='password' type='password' placeholder='password'/></div><div><button type='submit'>login</button></div></form>"
  );
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
router.post("/signup", signup);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
router.get("/confirmation/:token", confirmation);
router.get("/logout", logout);
module.exports = router;
