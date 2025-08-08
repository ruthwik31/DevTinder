const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // const user = new User({
  //   first_name: "manohar",
  //   last_name: "manu",
  //   emailId: "manumanohar@gmail.com",
  //   password: "32ew556",
  //   age: 21,
  //   gender: "male",
  // });
  // await user.save();
  // res.status(201).send("User created successfully");
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
