const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ordersRoutes = require("./routes/orders");
const productionRoutes = require("./routes/productionRoutes");
const packagingRoutes = require("./routes/packaging");
const bindingRoutes = require("./routes/binding");
const risoRoutes = require("./routes/riso");
const xeroxRoutes = require("./routes/xerox");
const toyocutRoutes = require("./routes/toyocut");
const outsourceRoutes = require("./routes/outsource");
const vendorRouter = require("./routes/vendors")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
const MONGO_URI =
  "mongodb+srv://maheshgowardipe100:J3zA3qcLNrjnvtrZ@cluster0.xkum8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/orders", ordersRoutes);
app.use("/api", productionRoutes);
app.use("/api", packagingRoutes);
app.use("/api", bindingRoutes);
app.use("/api", risoRoutes);
app.use("/api/xerox", xeroxRoutes);
app.use("/api/toyocut", toyocutRoutes);
app.use("/api/outsource", outsourceRoutes);
app.use("/api/vendor", vendorRouter)
