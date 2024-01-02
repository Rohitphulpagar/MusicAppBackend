const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const userWithEmail = await User.findOne({ email: userName });
    const userWithMobile = await User.findOne({ mobile: userName });
    const user = userWithEmail || userWithMobile;
    if (!user) {
      res.status(401).json({
        message: "Invalid email or mobile number",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const jwtToken = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRETE,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      status: "success",
      message: "user logged in",
      jwtToken: jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
});

module.exports = router;
