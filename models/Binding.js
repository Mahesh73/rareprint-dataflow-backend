const mongoose = require("mongoose");

const bindingSchema = new mongoose.Schema(
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
    bindingStatus: { type: String, default: "In Binding" },
    bindingDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Binding = mongoose.model("Binding", bindingSchema);
module.exports = Binding;
