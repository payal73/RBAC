// MUST BE AT THE VERY TOP
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoute = require("./routes/authRoute");
const razorpayRoute = require("./routes/razorPayRoute");
const app = express();

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use("/", authRoute);
app.use("/", razorpayRoute);

try {
  mongoose.connect(process.env.DB_URI, clientOptions);
  mongoose.connection.on("connected", () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on http://localhost:${process.env.PORT}`);
    });
  });
} catch (err) {
  console.error(`error${err.message}`);
  process.exit(1); // Exit process with failure
}
