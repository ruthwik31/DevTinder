const express = require("express");
const app = express();
//order matters
app.get("/abc/:userid/:pass", (req, res) => {
  console.log(req.params);
  res.send({ firstname: "ram", lastname: "reddy" });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
//order matters
// app.get("/user", (req, res) => {
//   res.send({ firstname: "ram", lastname: "reddy" });
// });
// app.post("/user", (req, res) => {
//   console.log("User data received");
//   res.send("User data received1");
// });
// app.delete("/user", (req, res) => {
//   console.log("deleted User");
//   res.send("deleted successfully");
// });
//matches all http methods
// app.use("/test", (req, res) => {
//   res.send("Hello, test!");
// });
