const express = require("express");

const {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const authRoute = express.Router();
authRoute.post("/signup", registerController);
authRoute.post("/login", loginController);
authRoute.get("/profile", authMiddleware, getProfileController);
authRoute.post("/profile", authMiddleware, updateProfileController);
module.exports = authRoute;
