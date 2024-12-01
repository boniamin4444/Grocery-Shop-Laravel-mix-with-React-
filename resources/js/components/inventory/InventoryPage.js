import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch inventory data and overview data
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [inventoryResponse, overviewResponse] = await Promise.all([
          axios.get(`/api/inventory?page=${currentPage}`), // Fetching Inventory Data with pagination
          axios.get('/api/inventory-overview'), // Fetching Overview Data
        ]);
        setInventory(inventoryResponse.data.data || []); // Inventory items
        setOverview(overviewResponse.data || {}); // Overview data
        setTotalPages(inventoryResponse.data.last_page); // Set total pages from Laravel pagination
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [currentPage]); // Trigger fetch on page change

  // Handle page change for pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container" style={{ marginTop: '20px' ,marginRight: '1px' }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        background: 'linear-gradient(to right, #00c6ff, #0072ff)', // Linear gradient background
        minHeight: '60vh'
      }}>
        {/* Inventory Section */}
        <div style={{
          flex: 2,
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          backgroundColor: '#eaf1f9',
        }}>
          <h2 style={{ color: '#007bff', fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Inventory Management</h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            border: '1px solid #ddd',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Product Name</th>
                <th style={{ padding: '12px' }}>Product Code</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Buying Price</th>
                <th style={{ padding: '12px' }}>Selling Price</th>
                <th style={{ padding: '12px' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} style={{
                  backgroundColor: '#f9f9f9',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{item.id}</td>
                  <td style={{ padding: '12px' }}>{item.product_name}</td>
                  <td style={{ padding: '12px' }}>{item.product_code}</td>
                  <td style={{ padding: '12px' }}>{item.category_name}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${item.buying_price}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${item.price}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{item.stock_amount} pcs</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center" style={{ padding: '10px' }}>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px'
                }}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)} style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px'
                  }}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px'
                }}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Overview Section */}
        <div style={{
          flex: 1,
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          backgroundColor: '#f9f9f9',
          maxHeight: '100vh', // Limit the height of the overview section
          overflowY: 'auto',
        }}>
          <h3 style={{ color: '#007bff', fontSize: '22px', fontWeight: '600', marginBottom: '20px' }}>Overview</h3>

          {/* Overview Table */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            border: '1px solid #ddd',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                <th style={{ padding: '12px' }}>Metric</th>
                <th style={{ padding: '12px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Customers</strong></td>
                <td style={{ padding: '12px' }}>{overview.total_customers || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Due Amount</strong></td>
                <td style={{ padding: '12px' }}>${overview.total_due_amount || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.total_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Products</strong></td>
                <td style={{ padding: '12px' }}>{overview.total_products || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Categories</strong></td>
                <td style={{ padding: '12px' }}>{overview.total_categories || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Total Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.total_sales || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Today's Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.today_sales || 0}</td>
              </tr>
            </tbody>
          </table>

          {/* Additional Sales & Profit Data */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            border: '1px solid #ddd',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                <th style={{ padding: '12px' }}>Sales/Profit Metric</th>
                <th style={{ padding: '12px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last Month Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_month_sales || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 3 Months Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_3_months_sales || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 6 Months Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_6_months_sales || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 1 Year Sales</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_1_year_sales || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Today's Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.today_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 3 Days Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_3_days_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 7 Days Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_7_days_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 15 Days Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_15_days_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 1 Month Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_months_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 3 Month Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_3_months_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 6 Month Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_6_months_profit || 0}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '12px' }}><strong>Last 1 Year Profit</strong></td>
                <td style={{ padding: '12px' }}>${overview.last_1_year_profit || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
