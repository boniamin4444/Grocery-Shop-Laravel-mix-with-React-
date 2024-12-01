import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfitOverviewPage.css'; // Import the custom CSS file

// OrdersTable Component to display orders
const OrdersTable = ({ filterOption, startDate, endDate, hoursAgo }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        let url = `/api/profit-overview-by-hourly?filterBy=${filterOption}`;

        if (filterOption === 'hour') {
            url += `&hoursAgo=${hoursAgo}`;
        } else if (filterOption === 'date_range') {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        // Fetch orders data
        fetch(url)
            .then(response => response.json())
            .then(data => setOrders(data.orders))
            .catch(error => console.error('Error fetching orders:', error));
    }, [filterOption, startDate, endDate, hoursAgo]);

    return (
        <div className="mt-4">
            <h3 className="text-primary">Orders</h3>
            <table className="table table-striped table-bordered table-hover custom-table">
                <thead className="thead-light">
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Total Sales Price</th>
                        <th>Buying Price</th>
                        <th>Total Quantity</th>
                        <th>Paid Amount</th>
                        <th>Due Amount</th>
                        <th>Discount (%)</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="table-row-hover">
                            <td>{order.id}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.customer_phone}</td>
                            <td>${order.total_price}</td>
                            <td>${order.total_buying_price}</td>
                            <td>{order.total_quantity}</td>
                            <td>${order.paid_amount}</td>
                            <td>${order.due_amount}</td>
                            <td>{order.extra_amount}%</td>
                            <td>${order.profit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ProfitOverviewByHourly Component to display the profit overview and filter options
const ProfitOverviewByHourly = () => {
    const [filterOption, setFilterOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hoursAgo, setHoursAgo] = useState(1);
    const [totalSales, setTotalSales] = useState(0);
    const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [isHourlyChecked, setIsHourlyChecked] = useState(false);
    const [isDateRangeChecked, setIsDateRangeChecked] = useState(false);

    // Fetch profit data
    const fetchProfitData = () => {
        let url = `/api/profit-overview-by-hourly?filterBy=${filterOption}`;

        if (filterOption === 'hour') {
            url += `&hoursAgo=${hoursAgo}`;
        } else if (filterOption === 'date_range') {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setTotalSales(data.total_sales);
                setTotalBuyingPrice(data.total_buying_price);
                setTotalProfit(data.total_profit);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        const { name, checked } = event.target;

        if (name === 'hourlyFilter') {
            setIsHourlyChecked(checked);
            setIsDateRangeChecked(false);
            if (checked) {
                setFilterOption('hour');
                setStartDate('');
                setEndDate('');
            } else {
                if (!isDateRangeChecked) {
                    setFilterOption('');
                }
            }
        }

        if (name === 'dateRangeFilter') {
            setIsDateRangeChecked(checked);
            setIsHourlyChecked(false);
            if (checked) {
                setFilterOption('date_range');
                setHoursAgo(1);
            } else {
                if (!isHourlyChecked) {
                    setFilterOption('');
                }
            }
        }
    };

    const handleHoursChange = (event) => {
        setHoursAgo(event.target.value);
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    useEffect(() => {
        if (filterOption) {
            fetchProfitData();
        }
    }, [filterOption, startDate, endDate, hoursAgo]);

    return (
        <div className="container my-5 card-container">
            <h1 className="text-center mb-4 text-primary">Profit Overview</h1>

            {/* Filter Options */}
            <div className="filter-options mb-4">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input checkbox-custom"
                        type="checkbox"
                        name="hourlyFilter"
                        id="hourlyFilter"
                        checked={isHourlyChecked}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="hourlyFilter">Hourly Profit</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input checkbox-custom"
                        type="checkbox"
                        name="dateRangeFilter"
                        id="dateRangeFilter"
                        checked={isDateRangeChecked}
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="dateRangeFilter">Date Range Profit</label>
                </div>
            </div>

            {/* Hourly Filter Options */}
            {isHourlyChecked && (
                <div className="hourly-options mb-4">
                    <label htmlFor="hoursAgo">Enter number of hours:</label>
                    <input
                        type="number"
                        id="hoursAgo"
                        min="1"
                        value={hoursAgo}
                        onChange={handleHoursChange}
                        className="form-control mb-3 input-custom"
                        style={{ width: '150px', display: 'inline' }}
                    />
                </div>
            )}

            {/* Date Range Filter Options */}
            {isDateRangeChecked && (
                <div className="date-range-options mb-4">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        className="form-control mb-3 input-custom"
                    />
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange}
                        className="form-control mb-3 input-custom"
                    />
                </div>
            )}

            {/* Display Total Sales, Buying Price, and Profit */}
            {filterOption && (
                <div className="mt-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Total Sales</th>
                                <th>Total Buying Price</th>
                                <th>Total Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${totalSales.toFixed(2)}</td>
                                <td>${totalBuyingPrice.toFixed(2)}</td>
                                <td>${totalProfit.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Orders Table - Placed Below Profit Overview */}
            <OrdersTable filterOption={filterOption} startDate={startDate} endDate={endDate} hoursAgo={hoursAgo} />
        </div>
    );
};

export default ProfitOverviewByHourly;
