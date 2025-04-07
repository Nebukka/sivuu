const API_URL = '/api/payment';

export const processPayment = async (orderId, paymentData) => {
  try {
    const response = await fetch(`${API_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentData }),
    });
    if (!response.ok) throw new Error('Payment processing failed');
    return await response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    return null;
  }
};
