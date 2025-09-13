const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      index: true,
      minLength: 4,
      maxLength: 20,
    },
    last_name: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{value} is not valid gender type`,
      },
      // validate(values) {
      //   if (!["male", "female", "other"].includes(values)) {
      //     throw new Error("Invalid gender");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/imgres?q=user%20profile%20images&imgurl=https%3A%2F%2Fuxwing.com%2Fwp-content%2Fthemes%2Fuxwing%2Fdownload%2Fpeoples-avatars%2Fuser-profile-icon.svg&imgrefurl=https%3A%2F%2Fuxwing.com%2Fuser-profile-icon%2F&docid=UagNtViPVDBRoM&tbnid=BcWdt6jvD1g-xM&vet=12ahUKEwjWm7WthoCPAxXlQ2cHHa4uFq8QM3oECCEQAA..i&w=800&h=800&hcb=2&ved=2ahUKEwjWm7WthoCPAxXlQ2cHHa4uFq8QM3oECCEQAA",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "Hello, I am using DevTinder!",
    },
    skills: {
      type: [String],
    },
    // DOB: {
    //   type: Date,
    //   default: Date.now
    // },
    // connectionRequests: [""],
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@RUTHWIK$31", {
    expiresIn: "4h",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};
// const User = mongoose.model("User", userSchema);
// module.exports = User;
module.exports = mongoose.model("User", userSchema);
