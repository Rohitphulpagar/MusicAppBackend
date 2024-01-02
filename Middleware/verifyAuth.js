const jwt = require("jsonwebtoken");

module.exports.checkToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRETE);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decode.userId; // global userId
    next();
  } catch (error) {
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
    });
  }
};
