import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Content({ page }) {
  const [overview, setOverview] = useState(null); // Overview data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get("/api/inventory-overview");
        setOverview(response.data);
      } catch (err) {
        setError("Error fetching overview data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Sales and Profit Chart Data
  const salesData = {
    labels: [
      "Today",
      "Last 3 Days",
      "Last 7 Days",
      "Last 15 Days",
      "Last Month",
      "Last 3 Months",
      "Last 6 Months",
      "Last 1 Year",
    ],
    datasets: [
      {
        label: "Sales ($)",
        data: [
          overview.today_sales || 0,
          overview.last_3_days_sales || 0,
          overview.last_7_days_sales || 0,
          overview.last_15_days_sales || 0,
          overview.last_month_sales || 0,
          overview.last_3_months_sales || 0,
          overview.last_6_months_sales || 0,
          overview.last_1_year_sales || 0,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const profitData = {
    labels: [
      "Today",
      "Last 3 Days",
      "Last 7 Days",
      "Last 15 Days",
      "Last Month",
      "Last 3 Months",
      "Last 6 Months",
      "Last 1 Year",
      "Last 3 Hours", // New label for 3 hours
      "Last 5 Hours", // New label for 5 hours
      "Last 8 Hours", // New label for 8 hours
    ],
    datasets: [
      {
        label: "Profit ($)",
        data: [
          overview.today_profit || 0,
          overview.last_3_days_profit || 0,
          overview.last_7_days_profit || 0,
          overview.last_15_days_profit || 0,
          overview.last_month_profit || 0,
          overview.last_3_months_profit || 0,
          overview.last_6_months_profit || 0,
          overview.last_1_year_profit || 0,
          overview.last_3_hours_profit || 0, // New profit data
          overview.last_5_hours_profit || 0, // New profit data
          overview.last_8_hours_profit || 0, // New profit data
        ],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Define custom colors for each card
  const cardStyles = [
    { backgroundColor: "#f3f4f6", borderColor: "#e2e8f0" },
    { backgroundColor: "#e0f7fa", borderColor: "#00bcd4" },
    { backgroundColor: "#e8f5e9", borderColor: "#4caf50" },
    { backgroundColor: "#fff3e0", borderColor: "#ff9800" },
    { backgroundColor: "#f3e5f5", borderColor: "#9c27b0" },
    { backgroundColor: "#fff9c4", borderColor: "#ffeb3b" },
    { backgroundColor: "#e1f5fe", borderColor: "#039be5" },
    { backgroundColor: "#f9fbe7", borderColor: "#8bc34a" },
    { backgroundColor: "#fbe9e7", borderColor: "#f44336" },
    { backgroundColor: "#e8eaf6", borderColor: "#3f51b5" },
    { backgroundColor: "#f1f8e9", borderColor: "#cddc39" },
  ];

  return (
    <main
      style={{
        flex: 1,
        padding: "20px",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <h2
        style={{
          display: "flex",
          marginLeft: "200px",
        }}
      >
        <div className="container">
           {page} Overview
        </div>
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px", // Reduced gap between cards
          marginBottom: "30px",
          marginLeft: "200px",
        }}
      >
        {/* Total Metrics Cards */}
        {[
          { label: "Total Customers", value: overview.total_customers },
          { label: "Total Due Amount", value: overview.total_due_amount },
          { label: "Total Profit", value: overview.total_profit },
          { label: "Total Products", value: overview.total_products },
          { label: "Total Categories", value: overview.total_categories },
          { label: "Total Sales", value: overview.total_sales },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              ...cardStyles[index % cardStyles.length],
              borderRadius: "8px",
              padding: "20px",
              margin: "5px", // 5px gap between cards
              textAlign: "center",
              flex: "1 1 calc(25% - 5px)", // 4 cards per row with minimal gap
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4>{card.label}</h4>
            <p>{card.value || 0}</p>
          </div>
        ))}

        {/* Sales and Profit Cards */}
        {[
          { label: "Today's Sales", value: overview.today_sales },
          { label: "Last 3 Days Sales", value: overview.last_3_days_sales },
          { label: "Last 7 Days Sales", value: overview.last_7_days_sales },
          { label: "Last 15 Days Sales", value: overview.last_15_days_sales },
          { label: "Last Month Sales", value: overview.last_month_sales },
          { label: "Last 3 Months Sales", value: overview.last_3_months_sales },
          { label: "Last 6 Months Sales", value: overview.last_6_months_sales },
          { label: "Last 1 Year Sales", value: overview.last_1_year_sales },
          { label: "Today's Profit", value: overview.today_profit },
          { label: "Last 3 Days Profit", value: overview.last_3_days_profit },
          { label: "Last 7 Days Profit", value: overview.last_7_days_profit },
          { label: "Last 15 Days Profit", value: overview.last_15_days_profit },
          { label: "Last Month Profit", value: overview.last_month_profit },
          { label: "Last 3 Months Profit", value: overview.last_3_months_profit },
          { label: "Last 6 Months Profit", value: overview.last_6_months_profit },
          { label: "Last 1 Year Profit", value: overview.last_1_year_profit },
          // New profit metrics
          { label: "Last 3 Hours Profit", value: overview.last_3_hours_profit },
          { label: "Last 5 Hours Profit", value: overview.last_5_hours_profit },
          { label: "Last 8 Hours Profit", value: overview.last_8_hours_profit },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              ...cardStyles[(index + 6) % cardStyles.length],
              borderRadius: "8px",
              padding: "20px",
              margin: "5px", // 5px gap between cards
              textAlign: "center",
              flex: "1 1 calc(25% - 5px)", // 4 cards per row with minimal gap
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4>{card.label}</h4>
            <p>${card.value || 0}</p>
          </div>
        ))}
      </div>

      {/* Sales and Profit Charts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px", // Reduced gap between cards
          marginBottom: "30px",
          marginLeft: "200px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h4>Sales Overview</h4>
          <Bar data={salesData} />
        </div>
        <div style={{ flex: 1 }}>
          <h4>Profit Overview</h4>
          <Line data={profitData} />
        </div>
      </div>
    </main>
  );
}

export default Content;
