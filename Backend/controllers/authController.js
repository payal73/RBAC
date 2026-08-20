const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const instance = require("../utils/razorpay");
const Payment = require("../models/razorPay");
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please Enter User Login Credentials!",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid User !" });
    }
    console.log(user);
    let { role } = user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        status: false,

        message: "Invalid Credential!",
      });
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: true,
      token: token,
      message: "User Logged In Successfully !",
      user: { name: user.name, email: user.email, role: role },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing Fields!" });
    }
    console.log("re.body", req.body);
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "Email already registered!" });
    }
    // Generate salt and hash the plaintext password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "You'r registered successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getProfileController = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const { name, email, role } = user;
    console.log("id", req.user);
    res.json({ success: true, user: { id, name, email, role } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error getting me data" });
  }
};
exports.updateProfileController = async (req, res) => {};
exports.razorPayController = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    // Razorpay expects the amount in the smallest currency sub-unit (e.g., paise for INR, cents for USD)
    // Example: To charge ₹500, pass 50000 paise
    const options = {
      amount: amount,
      currency: currency || "INR",
      receipt: receipt || `receipt_rcpt_${Date.now()}`,
      // Optional: Add metadata
      notes: {
        description: "E-commerce order transaction",
      },
    };
    const order = await instance.orders.create(options);
    console.log(order);
    if (!order) {
      return res
        .status(500)
        .send("An error occurred while generating the order.");
    }
    const payment = new Payment({
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
    await payment.save();
    // Send the generated order object back to the client side
    res.status(200).json({ order, key_id: process.env.Razor_Test_Key_ID });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};
