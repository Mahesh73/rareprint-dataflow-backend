const mongoose = require("mongoose");

const packagingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order.product",
      required: true,
    },
    invoiceNo: { type: String, required: true },
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    packagingStatus: { type: String, default: "In Packaging" },
    quantity: { type: Number, required: true },
    packagingDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Packaging = mongoose.model("Packaging", packagingSchema);
module.exports = Packaging;
