const express = require("express");
const router = express.Router();
const Riso = require("../models/Riso");

// DELETE Riso entry by ID
router.delete("/riso/:id", async (req, res) => {
  try {
    const risoId = req.params.id;

    const deletedRiso = await Riso.findByIdAndDelete(risoId);

    if (!deletedRiso) {
      return res.status(404).json({ message: "Riso entry not found" });
    }

    res.status(200).json({ message: "Riso entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Riso entry", error });
  }
});
router.get("/riso", async (req, res) => {
  try {
    const risoProduction = await Riso.find()
      .populate({
        path: "orderId",
        select: "customerName invoiceNo",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(risoProduction);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching RISO production data",
      details: error.message,
    });
  }
});
module.exports = router;
