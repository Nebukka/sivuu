// backend/config/coinbase.js
const coinbase = require('coinbase-commerce-node');
const Client = coinbase.Client;
const Checkout = coinbase.resources.Checkout;

// Configure the Coinbase Commerce API
Client.init('your-coinbase-commerce-api-key'); // Replace with your API key

const createCheckout = async (amount, productName) => {
    const checkout = new Checkout({
        name: productName,
        description: `Payment for ${productName}`,
        local_price: {
            amount: amount,
            currency: 'USD',
        },
        pricing_type: 'fixed_price',
        redirect_url: 'https://yourwebsite.com/success', // URL after payment
        cancel_url: 'https://yourwebsite.com/cancel', // URL if payment is canceled
    });

    try {
        await checkout.save();
        return checkout;
    } catch (error) {
        console.error('Error creating checkout:', error);
        throw error;
    }
};

module.exports = { createCheckout };
