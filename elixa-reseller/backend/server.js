// server.js (Backend)
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Order = require('./models/order'); // The Order model will track purchases

app.post('/api/purchase', async (req, res) => {
  const { userId, productId, paymentStatus } = req.body;
  
  if (paymentStatus === 'successful') {
    const order = new Order({
      userId,
      productId,
      status: 'completed',
      purchaseDate: new Date(),
      key: generateKey(), // Generate key logic
    });

    await order.save();
    res.json({ success: true, order });
  } else {
    res.status(400).json({ success: false, message: 'Payment failed' });
  }
});

function generateKey() {
  // Generate and return a random key (this would be more complex in reality)
  return 'ABC123XYZ';
}

mongoose.connect('mongodb://localhost:27017/elixa', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error(err));
