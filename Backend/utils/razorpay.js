const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.Razor_Test_Key_ID,
  key_secret: process.env.Razor_Test_Key_Secret,
});
module.exports = instance;
