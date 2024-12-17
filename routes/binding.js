const express = require("express");
const router = express.Router();
const Riso = require("../models/Riso");
const Order = require("../models/Order");
const Binding = require("../models/Binding");

router.get('/binding', async (req, res) => {
  try {
    // Fetch all entries from Binding collection
    const bindingOrders = await Binding.find().sort({ createdAt: -1 }) // Populate references if necessary
    res.status(200).json(bindingOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching binding orders.', error });
  }
});

// API to move a product from RISO to Binding
router.put("/production/moveToBinding", async (req, res) => {
  const { orderId, productId } = req.body;

  try {
    // Step 1: Find the product in RISO collection
    const risoProduct = await Riso.findOne({ orderId, productId });
    if (!risoProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in RISO collection." });
    }

    const order = await Order.findOne(
      { _id: orderId, "product._id": productId },
      {
        "product.$": 1, // Fetch only the matched product
        invoiceNo: 1, // Fetch invoiceNo
        customerName: 1, // Fetch customerName
      }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const product = order.product[0];

    // Step 2: Move the product to the Binding collection
    const newBindingEntry = new Binding({
      orderId: risoProduct.orderId,
      productId: risoProduct.productId,
      invoiceNo: order.invoiceNo,
      customerName: order.customerName,
      productName: product.productName,
      productCategory: product.category,
    });
    await newBindingEntry.save();

    // Step 3: Delete the product from the RISO collection
    await Riso.deleteOne({ orderId, productId });

    // Step 4: Update the product's status and statusHistory in the Order collection
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "product._id": productId }, // Find the order and specific product
      {
        $set: { "order.$.status": "Dispatched" },
        $push: {
          "product.$.status": { status: "Dispatched", date: new Date() }, // Add to statusHistory
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order or product not found." });
    }

    res.status(200).json({
      message: `Product moved from RISO to Binding successfully.`,
      bindingEntry: newBindingEntry,
      updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error moving product to Binding.", error });
  }
});

module.exports = router;
