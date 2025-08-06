const express = require("express");
const app = express();
// const { adminAuth, userAuth } = require("./middlewares/auth");
// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// app.get("/user", userAuth, (req, res) => {
//   res.send("user Data sent");
// });

// app.get("/admin/getAllData", (req, res) => {
//   res.send("all data sent");
// });
app.get("/getData", (req, res) => {
  try {
    throw new Error("This is an error");
    res.send("Data sent");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
app.use("/", (err, req, res, next) => {
  if (err) {
    // console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
