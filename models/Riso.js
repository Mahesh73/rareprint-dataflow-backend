const mongoose = require("mongoose");

const risoSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to Order collection
      required: true,
    },
    productId: String,
    paper: String,
    envelopSize: String,
    size: String,
    productName: String,
    printedQty: { type: Number, default: 0 },
    category: { type: String },
    gsm: { type: String },
    quantity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    prodQty: Number,
    design: String,
  },
  { timestamps: true }
);

const Riso = mongoose.model("Riso", risoSchema);
module.exports = Riso;
