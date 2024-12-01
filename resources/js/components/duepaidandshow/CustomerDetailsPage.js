import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, InputGroup } from 'react-bootstrap';

const CustomerDetailsPage = () => {
    const [phone, setPhone] = useState('');
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false); // For modal visibility

    useEffect(() => {
        let isMounted = true;

        const fetchCustomersWithDue = async () => {
            try {
                const response = await axios.get('/api/customers-with-due');
                if (isMounted) {
                    setCustomers(response.data);
                    setFilteredCustomers(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Unable to fetch customers with due amounts.');
                }
            }
        };

        fetchCustomersWithDue();
        const interval = setInterval(fetchCustomersWithDue, 1000); // Refresh every 5 seconds

        return () => {
            clearInterval(interval);
            isMounted = false;
        };
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get('/api/customer-details', { params: { customer_phone: phone } });
            setCustomer(response.data);
            setError(null);
        } catch (err) {
            setError('Customer not found.');
            setCustomer(null);
        }
    };

    const handleFilterByPhone = () => {
        setFilteredCustomers(
            phone ? customers.filter(customer => customer.customer_phone.includes(phone)) : customers
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mt-5">
            <h1>Customer Payment</h1>

            {/* Search by phone number */}
            <div className="mb-3">
                <InputGroup>
                    <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter customer phone number"
                    />
                    <Button variant="outline-secondary" onClick={handleFilterByPhone}>Search</Button>
                </InputGroup>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Customers Table with due amounts */}
            <h2 className="mt-4">Customers with Due Amounts</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Customers Name</th>
                        <th>Phone Number</th>
                        <th>Total Due Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.customer_name}</td>
                            <td>{customer.customer_phone}</td>
                            <td>{customer.total_due_amount}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setCustomer(customer);
                                        setShowModal(true);
                                    }}
                                >
                                    See Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Customer Details and Payment Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Customer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {customer && (
                        <>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <td><strong>Customer Name:</strong></td>
                                        <td>{customer.customer_name}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Address:</strong></td>
                                        <td>{customer.customer_address}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phone Number:</strong></td>
                                        <td>{customer.customer_phone}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Paid Amount:</strong></td>
                                        <td>{customer.total_paid_amount}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Due Amount:</strong></td>
                                        <td>{customer.total_due_amount}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Order Date:</strong></td>
                                        <td>{customer.create_at}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Paid Amount:</strong></td>
                                        <td>{customer.last_paid_amount}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>
                    )}

                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handlePrint}>Print</Button>
                </Modal.Footer>
            </Modal>

            {/* CSS for Print */}
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .modal-body, .modal-body * {
                        visibility: visible;
                    }
                    .modal-body {
                        position: left;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .modal-footer, .btn {
                        display: none;
                    }
                    .modal-body::after {
                        content: "Manager Signature: __________________________";
                        display: block;
                        margin-top: 40px;
                        text-align: left;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default CustomerDetailsPage;
