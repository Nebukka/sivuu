const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    products: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product' 
        },
        quantity: { 
          type: Number, 
          required: true,
          min: 1, // Ensures quantity is at least 1
        },
        price: { 
          type: Number, 
          required: true 
        },
        keyAssigned: { 
          type: String, 
          default: null, // Placeholder for storing the assigned key
        },
      },
    ],
    totalAmount: { 
      type: Number, 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
      default: 'Pending' 
    },
    orderStatus: { 
      type: String, 
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    transactionId: { 
      type: String, 
      default: null 
    },
  },
  { 
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Method to update the payment status and assign keys
OrderSchema.methods.updatePaymentStatus = async function (status, transactionId) {
  this.paymentStatus = status;
  this.transactionId = transactionId || this.transactionId;

  // If payment is completed, assign keys to products
  if (status === 'Completed') {
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.productId) {
        // Assign keys to the product (you would have logic for key assignment here)
        product.keyAssigned = `KEY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    }
  }

  await this.save();
};

module.exports = mongoose.model('Order', OrderSchema);
