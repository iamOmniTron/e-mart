const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/Users.model");
const { hash } = require("../helpers");
const passport = require("passport");

module.exports = {
  // login: (req,res) => {
  //   const {email,password} = req.body;
  //   if (!(email||pasword)) {
  //     req.flash('error','invalid email/password');
  //     res.redirect(/login);
  //   }
  // },

  // signup func
  signup: async (req, res) => {
    const { firstname, lastname, email, password, password2 } = req.body;
    if (password !== password2) {
      req.flash("error", "check that the passwords match");
      res.redirect("/signup");
    }
    const hashedPassword = await hash(password, 10);
    const token = crypto.randomBytes(20).toString("hex");
    const oneDay = 86400000;
    const expirationTime = +(Date.now() + oneDay);
    const user = new User({
      firstName: firstname,
      lastName: lastname,
      email: email,
      emailTokenValidity: expirationTime,
      emailToken: token,
      password: hashedPassword,
    });
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.GMAIL_SERVICE_NAME,
        auth: {
          user: process.env.GMAIL_USER_NAME,
          pass: process.env.GMAIL_USER_PASSWORD,
        },
      });
      const url = `http://${req.headers.host}/confirmation/${token}`;
      await transporter.sendMail({
        from: "<no-reply>@e-mart.com",
        to: `${email}`,
        subject: "Please confirm your email",
        text: `Please click this link to confirm your email ${url}`,
        html: `<p>Please click this link to confirm your email <a href=${url}>verify email address</a></p>`,
      });
      await user.save();
      res.json("check your mail for verification");
    } catch (err) {
      res.json(err.message);
    }
  },
  // confirm email func
  confirmation: async (req, res) => {
    const { token } = req.params;
    try {
      const user = await User.findOne({ emailToken: token });
      if (!user) {
        return res.json("user not found");
      }
      let currentTime = Date.now();
      if (currentTime > user.emailTokenValidity && !user.confirmed) {
        // req.flash("error", "you have to signup first");
        user.emailTokenValidity = null;
        return res.redirect("/signup");
      }
      user.confirmed = true;
      user.emailToken = null;
      user.emailTokenValidity = null;
      req.login(user, (err) => {
        if (err) {
          req.flash("error", err);
          return res.redirect("/login");
        }
        req.flash("success", `welcome ${user.firstName}`);
        res.redirect("/");
      });
    } catch (err) {
      res.json(err.message);
    }
  },
  logout: (req, refreshToken) => {
    req.logout();
    req.session = null;
    res.redirect("/login");
  },
};
