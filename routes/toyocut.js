const Order = require("../models/Order");
const Toyocut = require("../models/Toyocut");
const Xerox = require("../models/Xerox");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    productId,
    orderId,
    quantityPrinted,
    category,
    gsm,
    paper,
    printedQty,
    prodQty,
    productName,
    quantity,
    size,
  } = req.body;

  const order = await Order.findById(orderId._id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  try {
    // Create a new entry in Toyocut collection
    const newToyocutEntry = new Toyocut({
      productId,
      orderId,
      quantityPrinted,
      category,
      gsm,
      paper,
      printedQty,
      prodQty,
      productName,
      quantity,
      size,
    });

    await newToyocutEntry.save();

    const deletedXerox = await Xerox.findOneAndDelete({ productId: productId });

    if (!deletedXerox) {
      return res
        .status(404)
        .json({ message: "Xerox entry not found for this product" });
    }

    // Return a success response
    res.status(200).json({
      message: "Product moved to Toyocut successfully",
      newToyocutEntry,
    });
  } catch (error) {
    console.error("Error moving product to Toyocut:", error);
    res.status(500).json({ message: "Error moving product to Toyocut", error });
  }
});

router.get("/", async (req, res) => {
  try {
    // Fetch all products from the Toyocut collection
    const toyocutProducts = await Toyocut.find()
      .populate({
        path: "orderId",
        select: "customerName invoiceNo",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(toyocutProducts);
  } catch (error) {
    console.error("Error fetching Toyocut products:", error);
    res.status(500).json({ message: "Error fetching Toyocut products", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedXerox = await Toyocut.findByIdAndDelete(id);

    if (!deletedXerox) {
      return res.status(404).json({ message: "Toyocut entry not found" });
    }

    res.status(200).json({ message: "Toyocut entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Toyocut entry", error });
  }
});

module.exports = router;
