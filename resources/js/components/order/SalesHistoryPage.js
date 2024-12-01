import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function SalesHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/ordersreport');
      const sortedOrders = response.data.sort((a, b) => b.id - a.id);

      if (startDate && endDate) {
        const filteredOrders = sortedOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
        setOrders(filteredOrders);
      } else {
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`/api/ordersreport/${orderId}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content");
    const newWindow = window.open('', '', 'height=600, width=800');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.close();
    newWindow.print();
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const calculateTotalPrice = () => {
    if (!selectedOrder || !selectedOrder.items) return 0;
    return selectedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="container">
      <h1 style={{ fontWeight: 'bold' }}>Sales History</h1>
      
      {/* Date Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button variant="primary" onClick={fetchOrders}>Filter</Button>
      </div>

      <Table striped bordered hover style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', zIndex: '1', fontWeight: 'bold', border: '2px solid #000' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Phone Number</th>
            <th>Total Price</th>
            <th>Total Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ transition: 'background-color 0.3s' }} className="order-row">
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.customer_number}</td>
              <td>{order.total_price}</td>
              <td>{order.total_quantity}</td>
              <td>
                <Button variant="info" onClick={() => fetchOrderDetails(order.id)}>
                  Show Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal} size="lg" style={{ zIndex: 1050 }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 'bold' }}>Order Details - Order ID: {selectedOrder ? selectedOrder.id : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p style={{ fontWeight: 'bold' }}>Customer Name: {selectedOrder.customer_name}</p>
              <p style={{ fontWeight: 'bold' }}>Total Price: {selectedOrder.total_price}</p>
              <p style={{ fontWeight: 'bold' }}>Total Quantity: {selectedOrder.total_quantity}</p>
              <p style={{ fontWeight: 'bold' }}>Paid Amount: {selectedOrder.paid_amount ? selectedOrder.paid_amount : 'N/A'}</p>
              <p style={{ fontWeight: 'bold' }}>Due Amount: {selectedOrder.due_amount ? selectedOrder.due_amount : 'N/A'}</p>
              <p style={{ fontWeight: 'bold' }}>Discount Percent (%): {selectedOrder.extra_amount ? selectedOrder.extra_amount : 'N/A'}</p>
              <p style={{ fontWeight: 'bold' }}>Order Created At: {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'N/A'}</p>

              <h4 style={{ fontWeight: 'bold' }}>Total Price for All Items: {calculateTotalPrice()}</h4>

              <h3 style={{ fontWeight: 'bold' }}>Order Items:</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Category Name</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <tr key={item.id}>
                        <td>• {index + 1}</td>
                        <td>{item.category ? item.category.name : 'No Category'}</td>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No order items available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>

      <div id="printable-content" style={{ display: 'none' }}>
        {selectedOrder && (
          <>
            <h3 style={{ fontWeight: 'bold' }}>Order Report - Order ID: {selectedOrder.id}</h3>
            <p style={{ fontWeight: 'bold' }}>Customer Name: {selectedOrder.customer_name}</p>
            <p style={{ fontWeight: 'bold' }}>Total Price: {selectedOrder.total_price}</p>
            <p style={{ fontWeight: 'bold' }}>Total Quantity: {selectedOrder.total_quantity}</p>
            <p style={{ fontWeight: 'bold' }}>Paid Amount: {selectedOrder.paid_amount ? selectedOrder.paid_amount : 'N/A'}</p>
            <p style={{ fontWeight: 'bold' }}>Due Amount: {selectedOrder.due_amount ? selectedOrder.due_amount : 'N/A'}</p>
            <p style={{ fontWeight: 'bold' }}>Discount Percent (%): {selectedOrder.extra_amount ? selectedOrder.extra_amount : 'N/A'}</p>
            <p style={{ fontWeight: 'bold' }}>Order Created At: {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'N/A'}</p>

            <h3 style={{ fontWeight: 'bold' }}>Order Items:</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Category Name</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <tr key={item.id}>
                      <td>• {index + 1}</td>
                      <td>{item.category ? item.category.name : 'No Category'}</td>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No order items available.</td>
                  </tr>
                )}
              </tbody>
            </Table>
            
            <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <h4 style={{ fontWeight: 'bold' }}>Shop Manager</h4> <p style={{ fontWeight: 'bold' }}>Signature: ________________________</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalesHistoryPage;
