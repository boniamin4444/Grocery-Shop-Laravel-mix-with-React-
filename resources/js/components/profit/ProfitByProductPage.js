import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfitByProductPage = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the profit by product data from the backend API
    axios.get('/api/profit-by-product')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setProductData(response.data);
          setLoading(false);
        } else {
          setProductData([]);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching profit by product:', error);
        setProductData([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Profit by Product</h1>

      {/* Profit by Product Table */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-hover table-striped table-dark">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Selling Price ($)</th>
              <th>Buying Price ($)</th>
              <th>Profit ($)</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((item, index) => (
              <tr key={index}>
                <td>{item.order_id}</td>
                <td>{item.product_name}</td>
                <td>${item.selling_price ? item.selling_price.toFixed(2) : '0.00'}</td>
                <td>${item.buying_price ? item.buying_price.toFixed(2) : '0.00'}</td>
                <td className={item.profit >= 0 ? 'text-success' : 'text-danger'}>
                  ${item.profit ? item.profit.toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom CSS added below */}
      <style jsx>{`
        .container {
          max-width: 80%;
        }

        h1 {
          font-size: 36px;
          color: #007bff;
        }

        table {
          width: 100%;
          margin-top: 20px;
          background-color: #343a40;
          color: white;
          border-radius: 10px;
        }

        th {
          background-color: #007bff;
          color: white;
          text-align: center;
        }

        td {
          text-align: center;
        }

        .text-success {
          color: green;
        }

        .text-danger {
          color: red;
        }

        .table-responsive {
          margin-top: 30px;
        }

        .table-bordered {
          border: 1px solid #dee2e6;
        }

        .table-hover tbody tr:hover {
          background-color: #f1f1f1;
        }

        .table-striped tbody tr:nth-child(odd) {
          background-color: #f9f9f9;
        }

        .table-dark {
          background-color: #343a40;
        }
      `}</style>
    </div>
  );
};

export default ProfitByProductPage;
