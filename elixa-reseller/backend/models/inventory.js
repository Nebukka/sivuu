// models/inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  stock: { type: Number, required: true },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
