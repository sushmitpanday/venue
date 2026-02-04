require('dotenv').config();
const mongoose = require('mongoose');

async function dbconnection() {
  const uri = process.env.MONGOOSE_URL;
  if (!uri) {
    throw new Error("MongoDB URI is not defined");
  }

  await mongoose.connect(uri)
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Connection error:", err));
}

module.exports = dbconnection;
