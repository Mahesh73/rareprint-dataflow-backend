const Order = require("../models/Order");
const Riso = require("../models/Riso");
const Xerox = require("../models/Xerox");
const OutSource = require("../models/OutSource");

const addProductToProduction = async (req, res) => {
  const { orderId, productId } = req.params;
  const {
    chooseType,
    selectMachine,
    selectPaper,
    envelopSize,
    file,
    cost,
    dueDate,
    extraCharges,
    otherDetails,
    selectVendor,
    paperSize,
    prodQty,
    afterPrint,
  } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const product = order.product.id(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if production already exists
    if (product.production) {
      return res
        .status(400)
        .json({ error: "Production details already exist for this product" });
    }

    // Add production details
    product.production = {
      chooseType,
      selectMachine,
      selectPaper,
      envelopSize,
      file,
      cost,
      dueDate,
      extraCharges,
      otherDetails,
      selectVendor,
      paperSize,
      prodQty,
      afterPrint,
    };
    if (chooseType === "inHouse") {
      if (selectMachine === "riso") {
        const risoProduction = new Riso({
          productId: product._id,
          paper: selectPaper,
          envelopSize,
          orderId,
          productName: product.productName,
          category: product.category,
          gsm: product.gsm,
          quantity: product.quantity,
          size: product.size,
          prodQty,
          design: product.design,
        });
        await risoProduction.save();
      } else if (selectMachine === "xerox") {
        const xeroxProduction = new Xerox({
          orderId,
          productId: product._id,
          productName: product.productName,
          category: product.category,
          gsm: product.gsm,
          quantity: product.quantity,
          size: product.size,
          paper: selectPaper,
          prodQty,
          design: product.design,
        });
        await xeroxProduction.save();
      }
      product.status.push({ status: "Printing", updatedAt: new Date() });
      order.status = "In Progress";
    } else if (chooseType === "outsource") {
      const outsourceProduction = new OutSource({
        productId: product._id,
        vendorName: selectVendor,
        orderId,
        productName: product.productName,
        category: product.category,
        gsm: product.gsm,
        quantity: product.quantity,
        size: product.size,
        cost,
        extraCharges,
        dueDate,
        otherDetails,
      });
      product.status.push({ status: "Printing", updatedAt: new Date() });
      order.status = "Sent to Vendor";
      await outsourceProduction.save();
    }

    await order.save();
    return res
      .status(201)
      .json({ message: "Production details added successfully", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProductForProduction = async (req, res) => {
  const { orderId, productId } = req.params;
  const {
    chooseType,
    selectMachine,
    selectPaper,
    envelopSize,
    file,
    cost,
    dueDate,
    extraCharges,
    otherDetails,
    selectVendor,
    paperSize,
    prodQty,
    afterPrint,
  } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const product = order.product.id(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update production details
    product.production = {
      chooseType,
      selectMachine,
      selectPaper,
      envelopSize,
      file,
      cost,
      dueDate,
      extraCharges,
      otherDetails,
      selectVendor,
      paperSize,
      afterPrint,
      prodQty,
      afterPrint,
    };

    let updatedEntry;
    if (selectMachine === "riso") {
      updatedEntry = await Riso.findOneAndUpdate(
        { orderId, productId }, // Find the matching document
        { $set: { paper: selectPaper, envelopSize, prodQty } }, // Update the printedQuantity
        { new: true, runValidators: true } // Return the updated document
      );
    } else if (selectMachine === "xerox") {
      updatedEntry = await Xerox.findOneAndUpdate(
        { orderId, productId },
        { $set: { paper: selectPaper, prodQty, afterPrint } },
        { new: true, runValidators: true }
      );
    }

    await order.save();

    return res.status(200).json({
      message: "Production details updated successfully",
      updatedEntry,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProductionMachinePrint = async (req, res) => {
  try {
    const { orderId, productId, quantity, machine, status } = req.body;
    let updatedEntry;
    if (machine === "RISO") {
      updatedEntry = await Riso.findOneAndUpdate(
        { orderId, productId }, // Find the matching document
        { $set: { printedQty: quantity } }, // Update the printedQuantity
        { new: true, runValidators: true } // Return the updated document
      );
    } else {
      updatedEntry = await Xerox.findOneAndUpdate(
        { orderId, productId },
        { $set: { printedQty: quantity } },
        { new: true, runValidators: true }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "product._id": productId }, // Find the order and the specific product in the array
      {
        $push: {
          "product.$.status": {
            status: status,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order or product not found." });
    }

    res.status(200).json({
      message: "Printed quantity updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error starting production.", error });
  }
};

const getProductionDetails = async (req, res) => {
  try {
    const orders = await Order.find()
      .select("customerName _id product invoiceNo salesExecutive")
      .sort({ updatedAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    const formattedOrders = [];
    orders.forEach((order) => {
      const baseUrl = req.protocol + "://" + req.get("host");
      const sortedProducts = [...order.product].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      sortedProducts.forEach((product) => {
        formattedOrders.push({
          invoiceNo: order.invoiceNo,
          orderId: order._id,
          customerName: order.customerName,
          salesExecutive: order.salesExecutive,
          productName: product.productName,
          productCategory: product.category,
          productId: product._id,
          design: product.design
            ? `${baseUrl}/uploads/${product.design}`
            : null,
          size: product.size,
          qty: product.quantity,
          gsm: product.gsm,
          amount: product.amount,
          status: product.status,
          production: product.production,
        });
      });
    });
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching production data:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProductFromOrder = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    // Find the order by ID and update the products array
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the product index in the products array
    const productIndex = order.product.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    // Remove the product from the products array
    order.product.splice(productIndex, 1);

    // Save the updated order
    await order.save();

    res.status(200).json({ message: "Product removed from order", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing product", error: error.message });
  }
};

module.exports = {
  addProductToProduction,
  updateProductForProduction,
  getProductionDetails,
  updateProductionMachinePrint,
  deleteProductFromOrder,
};
