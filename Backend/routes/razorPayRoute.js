const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { razorPayController } = require("../controllers/authController");

const razorpayRoute = express.Router();
razorpayRoute.post("/create-order", authMiddleware, razorPayController);
module.exports = razorpayRoute;
