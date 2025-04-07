const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
  const { userId, products, totalAmount, paymentStatus, paymentMethod, paymentDetails } = req.body;

  try {
    // Check if the products exist in the database
    const productIds = products.map((product) => product.productId);
    const productsInDb = await Product.find({ '_id': { $in: productIds } });

    if (productsInDb.length !== products.length) {
      return res.status(404).json({ message: 'Some products were not found' });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      products: productsInDb,
      totalAmount,
      paymentStatus,
      paymentMethod,
      paymentDetails,
    });

    // Save the order to the database
    await newOrder.save();

    // Decrease product stock based on purchased quantity
    products.forEach(async (item) => {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email') // Populate user details
      .populate('products.productId', 'name price') // Populate product details
      .exec();

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate('userId', 'username email')
      .populate('products.productId', 'name price')
      .exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status (e.g., marking as shipped, completed, etc.)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting order' });
  }
};

// Get orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate('products.productId', 'name price')
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};
