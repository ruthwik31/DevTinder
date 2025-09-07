const express = require("express");
const reqRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
reqRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sendConnectionRequest called");
  res.send(user.first_name + ": Connection request sent");
});
module.exports = reqRouter;
