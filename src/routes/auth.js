const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
// post
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    validateSignUpData(req);

    //encrypt password
    const { first_name, last_name, emailId, password } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // req.body.password = passwordHash;

    //console.log(req.body);
    // const user = new User(req.body);
    const user = new User({
      first_name,
      last_name,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
//Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    } else {
      // Generate JWT token
      const token = await user.getJWT();
      res.cookie("token", token, { httpOnly: true });
      res.send("Login successful");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});
module.exports = authRouter;
