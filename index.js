const express = require("express");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
require("./googleAuth");

const isAuthenticated = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

const app = express();
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    expires: 60 * 60,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get("/protected", isAuthenticated, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/failure",
  })
);

app.get("/failure", (req, res) => {
  res.send("Fail to Authenticate");
});

app.listen(3000, () => console.log("Server is starting"));
