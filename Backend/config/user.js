const express = require("express");
const User = require("../models/user");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
userRoute.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  // Generate salt and hash the plaintext password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.status(200).send("You'r registered successfully!");
});
userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    console.log(user);
    let { role } = user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await jwt.sign({ email, role }, "RBAC", {
        expiresIn: "1h",
      });
    }
  }
});
module.exports = userRoute;
