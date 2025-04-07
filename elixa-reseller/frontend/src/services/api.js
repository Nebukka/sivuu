const API_URL = '/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/user/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Order creation failed');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};
