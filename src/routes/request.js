const express = require("express");
const reqRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

reqRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowdStatus = ["ignore", "interested"];
      // if (fromUserId.toString() === toUserId.toString()) {
      //   return res
      //     .status(400)
      //     .json({ message: "you cant send request to yourself" });
      // }
      if (!allowdStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }
      //request from the other side is already there
      const exsistingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (exsistingRequest)
        return res
          .status(400)
          .json({ message: "connection Request already sent" });
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.first_name + " is " + status + " in " + toUser.first_name,
        data,
      });
    } catch (err) {
      res.status(500).send("Error" + err.message);
    }
    //res.send(user.first_name + "sent the interested request");
  }
);
reqRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const allowdStatus = ["accepted", "rejected"];
      if (!allowdStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: req.params.requestId,
        toUserId: loggedInUser._id,
        status: "Interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
    } catch (err) {
      res.status(500).send("Error" + err.message);
    }
  }
);
module.exports = reqRouter;
