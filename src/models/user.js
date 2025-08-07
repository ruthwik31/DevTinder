const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  //   DOB: {
  //     type: Date,
  //     default: Date.now
  //   },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
