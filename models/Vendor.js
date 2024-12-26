const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, unique: true },
    city: { type: String, required: true },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);