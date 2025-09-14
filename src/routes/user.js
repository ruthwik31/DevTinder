const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
const USER_SAFE_DATA =
  "fromUserId last_name profilePic age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("Error" + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    req.statusCode(400).send("Error" + err.message);
  }
});
//feed?page=1&limit=10=>2-10=>.skip(1).limit(10)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); //skip().limit()
    const hideUserfromFeed = new set();
    connectionRequests.forEach((row) => {
      hideUserfromFeed.add(row.fromUserId.toString());
      hideUserfromFeed.add(row.toUserId.toString());
    });
    const users = await user
      .find({
        $and: [
          { _id: { $ne: loggedInUser._id } },
          { _id: { $nin: Array.from(hideUserfromFeed) } },
        ],
      })
      .select(USER_SAFE_DATA);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

module.exports = userRouter;
