// AdminDashboard.js
import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    keyType: '',
  });

  const handleAddProduct = async () => {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      alert('Product added successfully');
    }
  };

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch products and orders
    const fetchData = async () => {
      const productsRes = await axios.get('/api/admin/products');
      const ordersRes = await axios.get('/api/admin/orders');
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

      <section className="products">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product._id} className="product-card p-4 border rounded">
              <h3 className="text-xl">{product.name}</h3>
              <p>{product.description}</p>
              <p>Status: {product.status}</p>
              <p>Price: ${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="orders mt-8">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="order-card p-4 border rounded">
              <p>Order ID: {order._id}</p>
              <p>Product: {order.productName}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


  return (
    <div className="p-6 bg-gray-800 text-white">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
        />
        <select
          value={newProduct.keyType}
          onChange={(e) => setNewProduct({ ...newProduct, keyType: e.target.value })}
        >
          <option value="1day">1 Day</option>
          <option value="1week">1 Week</option>
          <option value="lifetime">Lifetime</option>
        </select>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
