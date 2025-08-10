const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

//post
app.post("/signup", async (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);
  if (Array.isArray(user.skills) && user.skills.length > 10) {
    return res.status(400).send("Skills cannot exceed 10 items");
  }
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
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

//Feed Api -GET/feed -get users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users");
  }
});

//delete
app.delete("/user", async (req, res) => {
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
app.patch("/user/:userId", async (req, res) => {
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
