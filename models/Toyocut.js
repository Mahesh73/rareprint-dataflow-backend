const mongoose = require("mongoose");

const toyocutSchema = new mongoose.Schema(
  {
    productId: String,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paper: String,
    size: String,
    productName: String,
    category: { type: String },
    printedQty: { type: Number, default: 0 },
    gsm: { type: String },
    quantity: { type: String },
    createdAt: { type: Date, default: Date.now },
    prodQty: Number,
    afterPrint: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Toyocut", toyocutSchema);
