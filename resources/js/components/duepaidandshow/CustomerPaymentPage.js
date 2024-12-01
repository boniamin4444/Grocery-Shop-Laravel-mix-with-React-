import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Collapse, Form, InputGroup, Table, Modal } from 'react-bootstrap';

const CustomerPaymentPage = () => {
    const [phone, setPhone] = useState('');
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [amountToPay, setAmountToPay] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [payDueOpen, setPayDueOpen] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
        const interval = setInterval(fetchCustomersWithDue, 5000);

        return () => {
            clearInterval(interval);
            isMounted = false;
        };
    }, []);

    const handlePayDue = async () => {
        if (amountToPay <= 0) {
            setError('Enter a valid amount.');
            return;
        }

        try {
            const response = await axios.post('/api/pay-due', {
                customer_number: customer?.customer_number,
                amount: amountToPay
            });

            if (response?.data?.updated_order) {
                setCustomer(prevCustomer => ({
                    ...prevCustomer,
                    total_paid_amount: response.data.updated_order.total_paid_amount,
                    total_due_amount: response.data.updated_order.total_due_amount
                }));
            }

            setMessage(response.data.message);
            setAmountToPay('');
            setPayDueOpen(false);
            setError(null);
        } catch (err) {
            setError('Error while processing payment.');
        }
    };

    const handleFilterByPhone = () => {
        if (!phone) {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(customer => customer.customer_phone.includes(phone));
            setFilteredCustomers(filtered);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmountToPay(value);

        // Live update total due amount
        if (customer && value >= 0) {
            const updatedDue = Math.max(0, customer.total_due_amount - value);
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                updated_due_amount: updatedDue, // Temporarily calculated value
            }));
        }
    };

    return (
        <div className="container mt-5">
            <h1>Customer Payment</h1>

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

            <h2 className="mt-4">Customers with Due Amounts</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Customer Name</th>
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
                                    Pay Due
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
                                        <td>{customer.updated_due_amount ?? customer.total_due_amount}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <Button
                                variant="primary"
                                onClick={() => setPayDueOpen(!payDueOpen)}
                                aria-expanded={payDueOpen}
                                aria-controls="payDueCollapse"
                            >
                                Pay Due
                            </Button>

                            <Collapse in={payDueOpen}>
                                <div id="payDueCollapse" className="mt-3">
                                    <Form>
                                        <Form.Group controlId="amountToPay">
                                            <Form.Label>Enter amount to pay</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={amountToPay}
                                                onChange={handleAmountChange}
                                                placeholder="Amount to pay"
                                            />
                                        </Form.Group>
                                        <Button variant="success" onClick={handlePayDue}>Pay</Button>
                                    </Form>
                                </div>
                            </Collapse>
                        </>
                    )}

                    {message && <div className="alert alert-success mt-3">{message}</div>}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CustomerPaymentPage;
