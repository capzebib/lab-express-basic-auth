const express = require("express");
const router = express.Router();

//User model
const User = require("../models/users");

//routes/auth.js
router.get("/auth", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
    .then(() => {
      if (username === "" || password === "") {
        res.render("auth/signup", {
          errorManage: "indicate a username and a password ti sign up"
        });
        return;
      }
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

User.findOne({ username: username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", {
        errorManage: "The username already exists!"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass
    })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    next(err);
  });

module.exports = router;
