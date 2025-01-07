// db.js
const mongoose = require("mongoose");
const { MONGODBURI } = require("../configuration/config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODBURI, {
      useNewUrlParser: true,
      dbName: "towards-better-bus-network",
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
};

module.exports = connectDB;
