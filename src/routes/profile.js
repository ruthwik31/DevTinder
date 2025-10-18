const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  validateEditProfileData,
  validateNewPassword,
  validateSignUpData,
} = require("../utils/validation");
//profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // user is set by userAuth middleware
    res.send(user);
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = validateProfileEditData(req);
    if (!isValid) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Update user profile with new data using updateOne method
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Feed Api -GET/feed -get users from database
profileRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users");
  }
});
//get user by email+
profileRouter.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    //findOne returns a single document, not an array
    //find returns an array
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

//delete
profileRouter.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting user: " + error.message);
  }
});

//update
//run validation on the entire object
profileRouter.patch("/user/:userId", userAuth, async (req, res) => {
  const data = req.body;
  //const userId = data.userId;
  const userId = req.params?.userId;
  if (data.skills > 10) {
    return res.status(400).send("Skills array cannot exceed 10 items");
  }
  const allowedUpdates = [
    "userId",
    "first_name",
    "photoUrl",
    "last_name",
    "password",
    "age",
    "about",
    "skills",
  ];
  const isUpdateAllowed = Object.keys(data).every((key) =>
    allowedUpdates.includes(key)
  );
  if (!isUpdateAllowed) {
    return res.status(400).send("Invalid update fields");
  }
  try {
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid update fields");
    }
    const loggeduser = req.user;
    // console.log("Authenticated user:", user);
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      loggeduser[key] = updates[key];
    });
    await loggeduser.save();
    res.send("Profile updated successfully");
  } catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
});

profileRouter.patch("/profile/password/forgot", userAuth, async (req, res) => {
  const { currPassword } = req.body;
  const { newPassword } = req.body;
  const isStrong = validateNewPassword(req, res);
  try {
    if (!isStrong) {
      throw new Error("The Password is no Strong Enough");
    } else {
      const loggedInUser = req.user;
      const { _id } = loggedInUser;
      const result = await User.findById(_id);
      const comparePassword = result.password;
      const isPasswordValid = await bcrypt.compare(
        currPassword,
        comparePassword
      );
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.updateOne(
          { _id: loggedInUser._id },
          { $set: { password: hashedPassword } }
        );
        res.send("The Password has been Successfully Changed");
      } else {
        throw new Error("The Current Password is incorrect");
      }
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
