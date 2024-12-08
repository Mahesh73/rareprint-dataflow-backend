const express = require("express");
const router = express.Router();
const Outsource = require("../models/OutSource");

router.delete("/:id", async (req, res) => {
  try {
    const outsourceId = req.params.id;

    const deletedOutSource = await Outsource.findByIdAndDelete(outsourceId);

    if (!deletedOutSource) {
      return res.status(404).json({ message: "Outsource entry not found" });
    }

    res.status(200).json({ message: "Outsource entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Outsource entry", error });
  }
});
router.get("/", async (req, res) => {
  try {
    const outsource = await Outsource.find().sort({ updatedAt: -1 });
    if (outsource.length === 0) {
      return res.status(404).json({ message: "No Outsource data found" });
    }
    return res.status(200).json(outsource);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching OutSource data",
      details: error.message,
    });
  }
});
module.exports = router;
