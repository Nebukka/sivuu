// backend/routes/adminRoutes.js
const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order.');
const User = require('../models/User');
const router = express.Router();

// Add Product
router.post('/addProduct', async (req, res) => {
  const { name, description, price, status, keyType } = req.body;

  try {
    const product = new Product({ name, description, price, status, keyType });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// Update Product
router.put('/updateProduct/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, status, keyType } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, { name, description, price, status, keyType });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Remove Product
router.delete('/removeProduct/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product', error });
  }
});

// backend/routes/adminRoutes.js
// View all orders
router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  });
  
  // Update Order Status
  router.put('/updateOrder/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., Pending, Completed, Cancelled
  
    try {
      const order = await Order.findByIdAndUpdate(id, { status });
      res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error });
    }
  });  

module.exports = router;
