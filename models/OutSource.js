const mongoose = require("mongoose");

// Define the Outsource schema
const outsourceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order collection
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order.product", // Reference to the product in the Order collection
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    extraCharges: {
      type: Number,
      default: 0, // Optional
    },
    dueDate: {
      type: Date,
      required: true,
    },
    otherDetails: {
      type: String,
      default: "",
    },
    productName: String,
    category: { type: String },
    gsm: { type: String },
    quantity: { type: Number, default: 0 },
    size: String,
  },
  { timestamps: true }
);

const Outsource = mongoose.model("Outsource", outsourceSchema);
module.exports = Outsource;
