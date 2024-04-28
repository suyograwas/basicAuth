const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  const databaseURL = process.env.DATABASE_URL;

  mongoose
    .connect(databaseURL, {})
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err) => {
      console.log(" Error :", err.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
