import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Chart, Filler} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfitOverviewPage.css'; // Custom CSS file for extra styling

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProfitOverviewPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [chartData, setChartData] = useState({});

  // Fetch data when the date range changes
  useEffect(() => {
    let isMounted = true; // Prevent state update after component unmount

    axios.get(`/api/profit-overview?range=${dateRange}`)
      .then(response => {
        if (isMounted) {
          console.log('API response data:', response.data); // Log the response data for debugging

          if (Array.isArray(response.data) && response.data.length > 0) {
            const ordersData = response.data;
            const dates = ordersData.map(order => {
              return order.created_at ? new Date(order.created_at).toLocaleDateString() : "Unknown Date";
            });
            const profits = ordersData.map(order => order.profit || 0);

            setOrders(ordersData);
            setChartData({
              labels: dates,
              datasets: [{
                label: 'Profit Over Time',
                data: profits,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
              }],
            });
            setLoading(false);
          } else {
            console.log('No data found.');
            setOrders([]);
            setChartData({
              labels: [],
              datasets: [],
            });
            setLoading(false);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching profit overview:', error.response ? error.response.data : error);
        setOrders([]);
        setChartData({
          labels: [],
          datasets: [],
        });
        setLoading(false);
      });

    return () => {
      isMounted = false; // Clean up on component unmount
    };
  }, [dateRange]);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Profit Overview</h1>

      {/* Date Range Filters */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {['today', 'last_3_days', 'last_7_days', 'last_1_month', 'last_3_months', 'last_6_months', 'last_1_year'].map((range, index) => (
          <button
            key={index}
            className={`btn btn-outline-primary m-2 ${dateRange === range ? 'active' : ''}`}
            onClick={() => setDateRange(range)}
          >
            {range.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container mb-4">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Profit ($)'
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: (context) => `$${context.raw.toFixed(2)}`
                }
              }
            }
          }}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Total Price ($)</th>
              <th>Total Buying Price ($)</th>
              <th>Profit ($)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const totalPrice = Number(order.total_price) || 0;
              const totalBuyingPrice = Number(order.total_buying_price) || 0;
              const profit = totalPrice - totalBuyingPrice;

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>${totalPrice.toFixed(2)}</td>
                  <td>${totalBuyingPrice.toFixed(2)}</td>
                  <td className={profit >= 0 ? 'text-success' : 'text-danger'}>
                    ${profit.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitOverviewPage;
