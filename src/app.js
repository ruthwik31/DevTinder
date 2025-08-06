const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);
// app.use("/user", userAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("user Data sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("all data sent");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
