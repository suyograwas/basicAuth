const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");
const user = require("./routes/user");
require("dotenv").config();

dbConnect();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is start on ${PORT} port`);
});

app.use("/api/v1", user);
