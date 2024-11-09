const express = require("express");
const router = express.Router();
const Xerox = require("../models/Xerox");

// DELETE Riso entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const xeroxId = req.params.id;

    const deletedXerox = await Xerox.findByIdAndDelete(xeroxId);

    if (!deletedXerox) {
      return res.status(404).json({ message: "Riso entry not found" });
    }

    res.status(200).json({ message: "Riso entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Riso entry", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const xeroxProduction = await Xerox.find()
      .populate({
        path: "orderId",
        select: "customerName invoiceNo",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(xeroxProduction);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching XEROX production data",
      details: error.message,
    });
  }
});

module.exports = router;
