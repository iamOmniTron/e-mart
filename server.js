const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/.env" });
}
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const mongoose = require("mongoose");
const { hash, validatePassword } = require("./helpers");
const User = require("./models/Users.model");
const router = require("./routes");
const secret = process.env.SECRET;
const mongoDB = process.env.MONGO_URI;
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongodb successfully"))
  .catch((err) => console.error("could not connect to mongodb", err));
app.use(logger("dev"));
// app.use('trust-proxy',true);
app.use(
  cors({
    // origin: "http://localhost:3000",
    // credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false);
        if (!validatePassword(user.password, password))
          return done(null, false);
        return done(null, user);
      } catch (err) {
        done(null, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      // passReqToCallback: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          const names = profile.displayName.split(/\b(\s)/);
          new User({
            firstName: names[0],
            lastName: names[1],
            googleId: profile.id,
            email: profile.emails[0].value,
            confirmed: true,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
app.use("/", router);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});
app.listen(port, () => {
  console.log(`app up and running at ${port} already!!!`);
});
