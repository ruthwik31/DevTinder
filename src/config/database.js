const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ruthwik31:62GFShy6TpcUEdWd@ruthwik31.thoyq80.mongodb.net/devTinder"
  );
};
//retrun the proimse
console.log("MongoDB connected");
module.exports = connectDB;
