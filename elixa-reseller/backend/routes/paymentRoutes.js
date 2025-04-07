const express = require('express');
const router = express.Router();
const stripe = require('stripe')('your-stripe-secret-key'); // Replace with your Stripe secret key
const { createCheckout } = require('../config/coinbase'); // Coinbase config file
const Product = require('../models/Product');
const Order = require('../models/Order');

// Coinbase Commerce Integration
// Create a Coinbase Checkout session
router.post('/create-checkout', async (req, res) => {
    const { productId, amount } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const checkout = await createCheckout(amount, product.name);
        const order = new Order({
            productId,
            amount,
            checkoutId: checkout.id,
            status: 'pending',
        });
        await order.save();

        res.send({ checkoutUrl: checkout.hosted_url });
    } catch (error) {
        res.status(500).send('Error creating checkout');
    }
});

// Webhook to handle payment confirmation from Coinbase
router.post('/webhook', (req, res) => {
    const webhookSecret = 'your-webhook-secret'; // Set this in your Coinbase settings

    try {
        const webhookHandler = require('coinbase-commerce-node').Webhooks;
        const event = webhookHandler.verify(req.body, req.headers['x-cc-webhook-signature'], webhookSecret);

        if (event.type === 'charge:confirmed') {
            const order = Order.findOneAndUpdate(
                { checkoutId: event.data.id },
                { status: 'confirmed' },
                { new: true }
            );
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).send('Webhook verification failed');
    }
});

// Stripe Payment Integration
// Create Stripe Checkout session
router.post('/create-stripe-session', async (req, res) => {
    const { productId, amount } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: amount * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://yourwebsite.com/success',
            cancel_url: 'https://yourwebsite.com/cancel',
        });

        const order = new Order({
            productId,
            amount,
            status: 'pending',
            stripeSessionId: session.id,
        });
        await order.save();

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).send('Error creating stripe session');
    }
});

// Manual Payment Route
// Process manual payments (e.g., via screenshots)
router.post('/manual-payment', async (req, res) => {
    const { orderId, paymentScreenshotUrl } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Update the order to 'manual' status
        order.status = 'manual';
        order.paymentScreenshotUrl = paymentScreenshotUrl;
        await order.save();

        res.status(200).send('Manual payment processed');
    } catch (error) {
        res.status(500).send('Error processing manual payment');
    }
});

// Handle payment success (for manual payments, Stripe, or Coinbase)
router.post('/payment-success', async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (paymentMethod === 'coinbase') {
            // Coinbase-specific logic (e.g., verify payment via Coinbase API)
            order.status = 'completed';
        } else if (paymentMethod === 'stripe') {
            // Stripe-specific logic (e.g., verify payment via Stripe API)
            order.status = 'completed';
        } else if (paymentMethod === 'manual') {
            // Manual payment processing (e.g., after confirmation)
            order.status = 'completed';
        }

        await order.save();
        res.status(200).send('Payment successful');
    } catch (error) {
        res.status(500).send('Error processing payment success');
    }
});

// Handle payment failure (e.g., failed transactions or user cancellations)
router.post('/payment-failure', async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        order.status = 'failed';
        await order.save();

        res.status(200).send('Payment failed');
    } catch (error) {
        res.status(500).send('Error processing payment failure');
    }
});

module.exports = router;
