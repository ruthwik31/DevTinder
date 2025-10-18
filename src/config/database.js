const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ruthwik31:62GFShy6TpcUEdWd@ruthwik31.thoyq80.mongodb.net/devTinder"
    );
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
// await mongoose.connect(process.env.MONGO_URI);
