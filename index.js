const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const register = require("./route/register");
const login = require("./route/login");
const products = require("./route/product");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("App connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/active", (req, res) => {
  res.status(200).json({ message: "SERVER IS RUNNING", status: "active" });
});

app.use("/user", register);
app.use("/user", login);
app.use("/user", products);
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${process.env.PORT}`);
});
