const express = require("express");
const multer = require("multer");
const Order = require("../models/Order");
const router = express.Router();
router.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).any();

// Route to create a new order
router.post("/", upload, async (req, res) => {
  try {
    const existingOrder = await Order.findOne({
      invoiceNo: req.body.invoiceNo,
    });
    if (existingOrder) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }

    const newProduct = req.body.product.map((item, i) => {
      console.log(item);
      return {
        ...item,
        design:
          req.files && req.files.length > 0 ? req.files[i]?.filename : null,
        status: [{ status: "Created", updatedAt: new Date() }],
      };
    });

    const orderData = {
      customerName: req.body.customerName,
      customerNo: req.body.customerNo,
      customerAdd: req.body.customerAdd,
      invoiceNo: req.body.invoiceNo,
      date: req.body.date,
      product: newProduct,
      salesExecutive: req.body.salesExecutive,
      paymentMethod: req.body.paymentMethod,
      advance: req.body.advance,
      description: req.body.description,
      designName: req.body.designName,
      leadSource: req.body.leadSource,
      courierCharges: req.body.courierCharges,
      status: "Order Created",
    };

    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route to get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ updatedAt: -1 });
    const formattedOrders = [];
    const baseUrl = req.protocol + "://" + req.get("host");
  // BOI by mahendra
    const currentDate = new Date(); // Get the current date
  //  EOI by mahendra

    orders.forEach((order) => {
  // BOI by mahendra
      // Convert order.date to a Date object
      const orderDate = new Date(order.date);

      // Calculate the difference in time (in milliseconds)
      const timeDifference = currentDate - orderDate;

      // Calculate age in days (you can also convert this to months or years if necessary)
      const ageInDays = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
      formattedOrders.push({
        advance: order.advance,
        courierCharges: order.courierCharges,
        date: order.date,
        customerAdd: order.customerAdd,
        customerName: order.customerName,
        customerNo: order.customerNo,
        description: order.description,
        designName: order.designName,
        invoiceNo: order.invoiceNo,
        leadSource: order.leadSource,
        paymentMethod: order.paymentMethod,
        product: order.product.map((item) => {
          item.design = item.design
            ? `${baseUrl}/uploads/${item.design}`
            : null;
          return item;
        }),
        salesExecutive: order.salesExecutive,
        status: order.status,
        updatedAt: order.updatedAt,
        _id: order._id,
        age: ageInDays, 
      });
    });
    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update an order by ID
router.put("/:id", upload, async (req, res) => {
  try {
    const orderData = {
      customerName: req.body.customerName,
      customerNo: req.body.customerNo,
      customerAdd: req.body.customerAdd,
      invoiceNo: req.body.invoiceNo,
      date: req.body.date,
      product: req.body.product,
      courierCharges: req.body.courierCharges,
      salesExecutive: req.body.salesExecutive,
      paymentMethod: req.body.paymentMethod,
      advance: req.body.advance,
      description: req.body.description,
      designName: req.body.designName,
      leadSource: req.body.leadSource,
      status: req.body.status,
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      orderData,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order updated successfully!", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
