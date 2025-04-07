import React, { useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  
  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? <p>Your cart is empty</p> : <ul>{cartItems.map(item => <li key={item.productId}>{item.name}</li>)}</ul>}
    </div>
  );
};

export default CartPage;
