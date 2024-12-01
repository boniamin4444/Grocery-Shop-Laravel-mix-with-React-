import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductStockUpdate = () => {
  const [products, setProducts] = useState([]);
  const [editingStock, setEditingStock] = useState(null); // Track which product is being edited
  const [newStock, setNewStock] = useState(''); // Hold the stock input value

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddStock = async (productId) => {
    try {
      await axios.post(`/api/products/${productId}/add-stock`, { stock: newStock });
      fetchProducts(); // Refresh the product list after updating stock
      setEditingStock(null); // Hide the input
      setNewStock(''); // Reset the stock input field
    } catch (err) {
      console.error('Error adding stock:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Products List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Buying Price</th>
            <th>Sales Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>
                {prod.image && (
                  <img
                    src={`/storage/${prod.image}`}
                    alt={prod.product_name}
                    style={{ width: '50px', height: '50px' }}
                  />
                )}
              </td>
              <td>{prod.product_name}</td>
              <td>{prod.description}</td>
              <td>{prod.buying_price}</td>
              <td>{prod.price}</td>
              <td>{prod.stock_amount}</td>
              <td>{prod.status === 'active' ? 'Active' : 'Inactive'}</td>
              <td>
                {editingStock === prod.id ? (
                  <div>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="Enter stock"
                    />
                    <button onClick={() => handleAddStock(prod.id)}>Add</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingStock(prod.id)}>Add Stock</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductStockUpdate;
