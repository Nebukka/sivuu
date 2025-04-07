const Product = require('../models/Product');

// Create new product
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, features } = req.body;
  try {
    const newProduct = new Product({ name, description, price, stock, features });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
