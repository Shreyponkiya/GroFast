const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const MongoConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};
module.exports = MongoConnection;