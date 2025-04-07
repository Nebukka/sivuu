const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    stock: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    features: { 
      type: [String], 
      required: true 
    },
    keyTypes: { 
      type: [String], 
      required: true,
      enum: ['1 day', '1 week', 'lifetime'] // Example key types, you can modify as needed
    },
    image: { 
      type: String, 
      default: 'default-product.jpg' // If you have a default image
    },
    downloadLink: { 
      type: String 
    },
    tutorialLink: { 
      type: String 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Assuming you have a User model to track who created the product
      required: true 
    }
  },
  { 
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Method to reduce stock after an order is placed
ProductSchema.methods.reduceStock = async function (quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    await this.save();
  } else {
    throw new Error('Not enough stock available');
  }
};

module.exports = mongoose.model('Product', ProductSchema);
