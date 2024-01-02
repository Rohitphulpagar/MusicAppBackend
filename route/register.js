const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        error: "Invalid input field",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    //creating new user
    const user = new User({
      name: name,
      mobile: mobile,
      email: email,
      password: hashPassword,
    });

    await user.save();

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "24",
    });
    res.json({
      message: "user registered succesfully",
      jwtToken: jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;
