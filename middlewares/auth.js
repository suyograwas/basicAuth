const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authentication").replace("Bearer ", "");

    if (!token || token === undefined) {
      res.status(401).json({
        status: "Fail",
        Message: "Login token is missing",
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);

      req.user = payload;
    } catch (err) {
      res.status(401).json({
        status: "fail",
        message: `invalid token: ${err.message}`,
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `Something went wrong while verifying user:  ${err.message}`,
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role != "student") {
      res.status(401).json({
        status: "fail",
        message: `This is protected route for student`,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `User role can not be verified:  ${err.message}`,
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "admin") {
      res.status(401).json({
        status: "fail",
        message: `This is protected route for admin`,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `User role can not be verified:  ${err.message}`,
    });
  }
};
