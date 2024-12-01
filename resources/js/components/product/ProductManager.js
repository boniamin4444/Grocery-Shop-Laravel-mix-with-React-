import React, { useEffect, useState } from 'react';
import './ProductManager.css'; // Import the CSS file
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    id: null,
    category_id: '',
    product_name: '',
    product_code: '',
    description: '',
    image: null,
    buying_price: '',
    price: '',
    stock_amount: '',
    status: 'active' || 'inactive',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      //console.log(response.data); // Log the fetched products to inspect the data
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error fetching products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error fetching categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('category_id', product.category_id);
    formData.append('product_name', product.product_name);
    formData.append('product_code', product.product_code);
    formData.append('description', product.description);
    formData.append('buying_price', product.buying_price); // Include buying price
    formData.append('price', product.price);
    formData.append('stock_amount', product.stock_amount);
    formData.append('status', product.status);

    if (product.image) {
      formData.append('image', product.image);
    }

    setError('');

    try {
      if (isEditing) {
        await axios.post(`/api/products/update/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetForm();
      fetchProducts();
      setFormVisible(false);
    } catch (err) {
      console.error('Error adding/updating product:', err.response?.data);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('Error adding/updating product: The given data was invalid.');
      }
    }
  };

  const handleEdit = (prod) => {
    setProduct({
      id: prod.id,
      category_id: prod.category_id || '',
      product_name: prod.product_name || '',
      product_code: prod.product_code || '',
      description: prod.description || '',
      image: null,
      buying_price: prod.buying_price || '', // Set buying price on edit
      price: prod.price || '',
      stock_amount: prod.stock_amount || '',
      status: prod.status || 'active',
    });
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setProduct({
      id: null,
      category_id: '',
      product_name: '',
      product_code: '',
      description: '',
      image: null,
      buying_price: '',
      price: '',
      stock_amount: '',
      status: 'active',
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <button
        className="btn btn-primary mb-4"
        onClick={() => setFormVisible(!formVisible)} // Toggle form visibility
      >
        {formVisible ? 'Hide Form' : 'Add Product'}
      </button>

      {formVisible && (
        <div>
          <h2 className="mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-group">
              <label htmlFor="category_id" className="form-label">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                className="form-control mb-3"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product_name" className="form-label">Product Name</label>
              <input
                id="product_name"
                name="product_name"
                value={product.product_name}
                onChange={handleChange}
                className="form-control"
                placeholder="Product Name"
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="product_code" className="form-label">Product Code</label>
              <input
                id="product_code"
                name="product_code"
                value={product.product_code}
                onChange={handleChange}
                className="form-control"
                placeholder="Product Code"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">Product Image</label>
              <input
                id="image"
                type="file"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buying_price" className="form-label">Buying Price</label>
              <input
                id="buying_price"
                name="buying_price"
                type="number"
                value={product.buying_price}
                onChange={handleChange}
                className="form-control"
                placeholder="Buying Price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">Selling Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock_amount" className="form-label">Stock Amount</label>
              <input
                id="stock_amount"
                name="stock_amount"
                type="number"
                value={product.stock_amount}
                onChange={handleChange}
                className="form-control"
                placeholder="Stock Amount"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={product.status}
                onChange={handleChange}
                className="form-control mb-3"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn btn-secondary ml-2">
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      <h2 className="mb-4">Products List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Description</th>
            <th>Buying Price</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>
                {prod.image && (
                  <img
                    src={`/storage/${prod.image}`} // Corrected image path
                    alt={prod.product_name}
                    style={{ width: '50px', height: '50px' }}
                  />
                )}
              </td>
              <td>{prod.product_name}</td>
              <td>{prod.product_code}</td>
              <td>{prod.description}</td>
              <td>{prod.buying_price}</td>
              <td>{prod.price}</td>
              <td>{prod.stock_amount}</td>
              <td>{prod.status === 'active' ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleEdit(prod)} className="btn btn-warning btn-sm mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(prod.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
