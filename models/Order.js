const mongoose = require("mongoose");
const { Schema } = mongoose;

const production = new Schema(
  {
    chooseType: { type: String },
    selectMachine: { type: String },
    selectPaper: { type: String },
    envelopSize: { type: String },
    paperSize: String,
    cost: String,
    dueDate: String,
    extraCharges: String,
    otherDetails: String,
    selectVendor: String,
    prodQty: Number,
    afterPrint: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const statusSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "Created",
        "Printing",
        "Printing Inprogress",
        "Printing Completed",
        "Packaging",
        "Dispatched",
        "Delivered",
        "Outsource"
      ],
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    productName: { type: String },
    category: { type: String },
    gsm: { type: String },
    quantity: Number,
    size: { type: String },
    amount: { type: String },
    production: production,
    productDescription: String,
    code: String,
    design: String,
    status: [statusSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const orderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerNo: { type: String, required: true },
    customerAdd: { type: String, required: true },
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date },
    product: [productSchema],
    salesExecutive: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    advance: String,
    description: { type: String },
    designName: { type: String },
    leadSource: { type: String },
    status: { type: String },
    courierCharges: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
