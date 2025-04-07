// CheckoutPage.js
import React, { useState } from 'react';

const CheckoutPage = ({ product }) => {
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // Default to crypto
  const [orderStatus, setOrderStatus] = useState('');

  const handlePayment = () => {
    // Call backend API to process payment (assuming payment is successful)
    setOrderStatus('Payment Successful! Proceeding to order confirmation...');
    // Trigger the API for order creation
  };

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p>{product.name} - {product.keyType}</p>
      <p>Total: ${product.price}</p>
      
      <div>
        <label htmlFor="payment-method">Select Payment Method:</label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-2 rounded bg-gray-700"
        >
          <option value="crypto">Crypto</option>
          <option value="stripe">Stripe</option>
          <option value="manual">Manual Payment</option>
        </select>
      </div>

      <button onClick={handlePayment} className="mt-4 bg-green-500 text-white p-2 rounded">
        Confirm Payment
      </button>

      {orderStatus && <p className="mt-4">{orderStatus}</p>}
    </div>
  );
};

export default CheckoutPage;
