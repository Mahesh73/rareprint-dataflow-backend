const mongoose = require("mongoose");

const xeroxSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to Order collection
      required: true,
    },
    productId: String,
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
    design: String,
  },
  { timestamps: true }
);

const Xerox = mongoose.model("Xerox", xeroxSchema);
module.exports = Xerox;
