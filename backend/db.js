const mongoose = require("mongoose");
const password = encodeURIComponent("Shiva15");

const mongoURI =
`mongodb+srv://gssreddy16:${password}@cluster0.hpwpr2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = mongoDB;