const express = require("express");
const app = express();
//order matters
app.get("/user", (req, res) => {
  res.send({ firstname: "ram", lastname: "reddy" });
});
app.post("/user", (req, res) => {
  console.log("User data received");
  res.send("User data received1");
});
app.delete("/user", (req, res) => {
  console.log("deleted User");
  res.send("deleted successfully");
});
//matches all http methods
app.use("/test", (req, res) => {
  res.send("Hello, test!");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
