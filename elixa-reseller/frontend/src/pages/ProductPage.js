// ProductPage.js
import React, { useState } from 'react';

const ProductPage = ({ product }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handlePurchase = () => {
    // Trigger purchase process
    setIsPurchased(true);
    // On success, assign the download link (this can be dynamic)
    setDownloadLink('/path/to/download/tutorial');
  };

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="mt-2">{product.description}</p>
      <div className="mt-4">
        <p><strong>Key Type:</strong> {product.keyType}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <button onClick={handlePurchase} className="mt-2 bg-green-500 text-white p-2 rounded">
          Buy Now
        </button>
      </div>

      {isPurchased && (
        <div className="mt-4">
          <p>Your purchase is complete. You can download the tutorial below:</p>
          <a href={downloadLink} className="text-blue-400" target="_blank" rel="noopener noreferrer">
            Download Tutorial
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
