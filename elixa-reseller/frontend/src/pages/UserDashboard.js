import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch user info from backend
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setOrders(data.orders);
      });
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user && (
        <>
          <h2>Welcome, {user.name}</h2>
          <h3>Your Orders</h3>
          <ul>
            {orders.map(order => (
              <li key={order._id}>
                Order #{order._id} - Status: {order.paymentStatus}
              </li>
            ))}
          </ul>
          <Link to="/support">Contact Support</Link>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
