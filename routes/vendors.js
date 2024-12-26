const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Vendor registration API
router.post('/register', async (req, res) => {
  try {
    const { name, email, contactNumber, city, address } = req.body;

    // Validate input
    if (!name || !email || !contactNumber || !address) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Check if the vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor with this email already exists.' });
    }

    // Create a new vendor
    const newVendor = new Vendor({
      name,
      email,
      contactNumber,
      city,
      address,
    });

    // Save the vendor to the database
    await newVendor.save();

    res.status(201).json({ message: 'Vendor registered successfully.', vendor: newVendor });
  } catch (error) {
    console.error('Error registering vendor:', error);
    res.status(500).json({ error: 'An error occurred while registering the vendor.' });
  }
});

router.put('/update/:vendorId', async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { name, email, contactNumber, city, address } = req.body;
  
      // Validate input
      if (!name || !email || !contactNumber || !address) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
      }
  
      // Find and update the vendor
      const updatedVendor = await Vendor.findByIdAndUpdate(
        vendorId,
        { name, email, contactNumber, city, address },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedVendor) {
        return res.status(404).json({ message: 'Vendor not found.' });
      }
  
      res.status(200).json({ message: 'Vendor updated successfully.', vendor: updatedVendor });
    } catch (error) {
      console.error('Error updating vendor:', error);
      res.status(500).json({ error: 'An error occurred while updating the vendor.' });
    }
  });


  router.get('/', async (req, res) => {
    try {
      const vendors = await Vendor.find().sort({ createdAt: -1 }); // Sort by latest
      if (!vendors || vendors.length === 0) {
        return res.status(404).json({ message: 'No vendors found.' });
      }
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: 'An error occurred while fetching vendors.' });
    }
  });

  router.delete('/delete/:vendorId', async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // Find and delete the vendor
      const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  
      if (!deletedVendor) {
        return res.status(404).json({ message: 'Vendor not found.' });
      }
  
      res.status(200).json({ message: 'Vendor deleted successfully.', vendor: deletedVendor });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      res.status(500).json({ error: 'An error occurred while deleting the vendor.' });
    }
  });

module.exports = router;
