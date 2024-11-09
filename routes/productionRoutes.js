const express = require("express");
const router = express.Router();
const {
  updateProductForProduction,
  addProductToProduction,
  getProductionDetails,
  updateProductionMachinePrint,
} = require("../controllers/productionController");
const {
  deleteProductFromOrder,
} = require("../controllers/productionController");

// Update production details for a specific product in an order
router.put(
  "/orders/:orderId/products/:productId/production",
  updateProductForProduction
);

// // Add production details to a specific product in an order
router.post(
  "/orders/:orderId/products/:productId/production",
  addProductToProduction
);

router.post("/production/machine/printQty", updateProductionMachinePrint);

// Route to get production details
router.get("/production-details", getProductionDetails);

// Route to delete a specific product from an order
router.delete("/orders/:orderId/products/:productId", deleteProductFromOrder);

module.exports = router;
