const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        status: "fail",
        message: "User are already exist !",
      });
    }

    let hashPassword;

    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "Error while hashing !",
      });
    }

    const user = await User.create({
      name,
      password: hashPassword,
      email,
      role,
    });

    res.status(200).json({
      status: "success",
      message: "User successful  created!",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error while signup user !",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "User is not registered",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        status: "success",
        data: {
          user,
          token,
        },
      });
    } else {
      res.status(403).json({
        status: "fail",
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `Login Failure!: ${err.message}`,
    });
  }
};
