import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [orderItems, setOrderItems] = useState(Array(5).fill(null));
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
   
    const [selectedOldCustomer, setSelectedOldCustomer] = useState('');
    const [extraAmountChecked, setExtraAmountChecked] = useState(false);
    const [extraAmount, setExtraAmount] = useState(0);
    
    const contextMenuRef = useRef(null); // useRef for context menu (do not use useState for this)

    useEffect(() => {
        fetchCategories();
       
        fetchOldCustomers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu]);

   
    
    const fetchOldCustomers = async () => {
        try {
            const response = await axios.get('/api/orders/customers');
            setOldCustomers(response.data);
        } catch (error) {
            console.error("Error fetching old customers:", error);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        const filtered = products.filter(product => product.category_id === parseInt(categoryId));
        setFilteredProducts(filtered);
    };

    const handleProductClick = (product, rowIndex) => {
        const updatedItems = [...orderItems];
        updatedItems[rowIndex] = {
            product_id: product.id,
            category_id: product.category_id,
            product_name: product.product_name,
            product_code: product.product_code,
            quantity: 1,
            price: product.price,
        };
        setOrderItems(updatedItems);
        setContextMenu(null);
        setFilteredProducts(filteredProducts.filter(p => p.id !== product.id));
    };

   

    const updateQuantity = (productId, quantity) => {
        setOrderItems(orderItems.map(item =>
            item && item.product_id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

   

    const grandTotal = totalWithExtraAmount + previousDueAmount - paidAmount;

    const handleOldCustomerChange = async (e) => {
        const selectedCustomerName = e.target.value;
        setSelectedOldCustomer(selectedCustomerName);

        const selectedCustomer = oldCustomers.find(customer => customer.customer_name === selectedCustomerName);
        if (selectedCustomer) {
            setCustomerName(selectedCustomer.customer_name);
            setCustomerAddress(selectedCustomer.customer_address || '');
            setCustomerPhone(selectedCustomer.customer_phone || '');
            
            try {
                const response = await axios.get(`/api/orders/customers/${selectedCustomer.customer_number}`);
                setPreviousDueAmount(response.data.due_amount || 0);
            } catch (error) {
                console.error("Error fetching due amount:", error);
                setPreviousDueAmount(0);
            }
        } else {
            setCustomerName('');
            setCustomerAddress('');
            setCustomerPhone('');
            setPreviousDueAmount(0);
        }
    };

    const handleSubmitOrder = async () => {
        const validItems = orderItems.filter(item => item !== null);
    
        // Ensure customer name is present
        if (!customerName || !validItems.length) {
            alert('Please fill out the customer name and add at least one product.');
            return;
        }
    
        // Calculate the discount price
        const discountPrice = calculateTotals();
    
        // Prepare order data
        const orderData = {
            customer_name: customerName,
            customer_address: customerAddress,
            customer_phone: customerPhone,
            products: validItems,
            paid_amount: paidAmount,
            extra_amount: extraAmount,  // Send the extra amount if any
            customer_number: oldCustomerChecked ? 
                oldCustomers.find(customer => customer.customer_name === selectedOldCustomer)?.customer_number 
                : null, // Only add the customer_number if old customer is selected
        };
    
        try {
            // Send the order data to the backend
            const response = await axios.post('/api/orders', orderData);
    
            const newDueAmount = response.data.due_amount;
            setPreviousDueAmount(newDueAmount);
    
            // Set order report data including the discount price
            setOrderReport({
                ...orderData,
                discountPrice, // Add discount price to the report
                dueAmount: newDueAmount,
                grandTotal,
                previousDueAmount,
                totalWithExtraAmount,
            });
    
            // Reset the form after successful submission
            resetForm();
            setShowModal(true); // Show modal after submission
        } catch (error) {
            console.error("Error submitting order:", error);
            handleErrorResponse(error);
        }
    };    

    const handleErrorResponse = (error) => {
        if (error.response) {
            if (error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(`Submission failed:\n${errorMessages}`);
            } else if (error.response.data.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } else {
            alert('An error occurred while submitting the order. Please try again.');
        }
    };

    const resetForm = () => {
        setOrderItems(Array(5).fill(null));
        setCustomerName('');
        setCustomerAddress('');
        setCustomerPhone('');
        setPaidAmount(0);
        setTotalQuantity(0);
        setTotalPrice(0);
        setPreviousDueAmount(0);
        setSelectedOldCustomer('');
        setOldCustomerChecked(false);
        setExtraAmountChecked(false); 
        setExtraAmount(0); 
        setFilteredProducts(products);
    };

    const addNewRow = () => {
        setOrderItems([...orderItems, null]);
    };

    const handleRemoveProduct = (index) => {
        const updatedItems = orderItems.filter((_, i) => i !== index);
        const removedItem = orderItems[index];
        if (removedItem) {
            setFilteredProducts([...filteredProducts, removedItem]);
        }
        setOrderItems(updatedItems);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePrintReport = () => {
        // Get the modal content by ID
        const modalContent = document.getElementById('orderReportModalContent').innerHTML;
    
        // Create an invisible iframe
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
    
        // Write modal content to iframe
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(`
            <html>
                <head>
                    <title>Print Order Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                        }
                        .modal-content {
                            width: 100%;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 10px;
                        }
                        @media print {
                            .btn, .modal-footer { display: none; } /* Hide buttons and footer when printing */
                        }
                    </style>
                </head>
                <body>
                    <div class="modal-content">
                        ${modalContent}
                    </div>
                </body>
            </html>
        `);
        iframe.contentWindow.document.close();
    
        // Trigger print and remove the iframe after printing
        iframe.contentWindow.print();
        iframe.contentWindow.onafterprint = () => {
            document.body.removeChild(iframe);
        };
    };        
    

    return (
        <div className="container mt-4">
    <h2 className="text-center mb-4 fw-bold" style={{ color: '#343a40' }}>Create Sales</h2>

    {/* Old Customer Check */}
    <div className="mb-3">
    <label className="form-check-label" style={{ display: 'flex', alignItems: 'center' }}>
        <input
            type="checkbox"
            className="form-check-input"
            checked={oldCustomerChecked}
            onChange={(e) => setOldCustomerChecked(e.target.checked)}
            style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#007bff', // Sets the checkmark color to blue
                border: '2px solid #007bff', // Custom border color for the checkbox
                borderRadius: '4px', // Slightly rounded corners
            }}
        />
        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#007bff' }}>See Old Customer</span>
    </label>
</div>


    {/* Old Customer Dropdown */}
    {oldCustomerChecked && (
        <div className="mb-3">
            <label className="fw-bold" style={{ color: '#007bff' }}>Select Old Customer:</label>
            <select
                className="form-select"
                value={selectedOldCustomer}
                onChange={handleOldCustomerChange}
                style={{ borderColor: '#007bff' }}
            >
                <option value="">Select an Old Customer</option>
                {oldCustomers.map(customer => (
                    <option key={customer.customer_number} value={customer.customer_name}>
                        {customer.customer_name}
                    </option>
                ))}
            </select>
        </div>
    )}

    {/* Customer Details */}
    <div className="mb-3">
  <label className="form-label fw-bold" style={{ color: '#28a745' }}>Customer Name:</label>
  <input
    type="text"
    className="form-control"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    readOnly={oldCustomerChecked}
    style={{
      borderColor: '#28a745',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', 
      zIndex: 10, 
    }}
  />
</div>

<div className="mb-3">
  <label className="form-label fw-bold" style={{ color: '#dc3545' }}>Customer Address:</label>
  <input
    type="text"
    className="form-control"
    value={customerAddress}
    onChange={(e) => setCustomerAddress(e.target.value)}
    readOnly={oldCustomerChecked}
    style={{
      borderColor: '#dc3545',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // box-shadow added here
      zIndex: 10, // z-index added here
    }}
  />
</div>
<div className="mb-3">
  <label className="form-label fw-bold" style={{ color: '#ffc107' }}>Customer Phone:</label>
  <input
    type="text"
    className="form-control"
    value={customerPhone}
    onChange={(e) => setCustomerPhone(e.target.value)}
    readOnly={oldCustomerChecked}
    style={{
      borderColor: '#ffc107',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // box-shadow added here
      zIndex: 10, // z-index added here
    }}
  />
</div>


    {/* Order Items Table */}
    <table className="table table-striped shadow" style={{ boxShadow: '0px 8px 20px rgba(0,0,0,0.3)', borderColor: '#007bff' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
                <th className="fw-bold" style={{ color: '#007bff' }}>Category</th>
                <th className="fw-bold" style={{ color: '#28a745' }}>Product</th>
                <th className="fw-bold" style={{ color: '#dc3545' }}>Quantity</th>
                <th className="fw-bold" style={{ color: '#ffc107' }}>Price</th>
                <th className="fw-bold" style={{ color: '#20c997' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {orderItems.map((item, index) => (
                <tr key={index} onContextMenu={(e) => handleRightClickRow(e, index)}>
                    <td>
                        <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory || ''} className="form-select" style={{ borderColor: '#007bff' }}>
                            <option value="">Select a Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </td>
                   
                    <td>
                        {item ? (
                            <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                style={{ borderColor: '#28a745' }}
                            />
                        ) : "N/A"}
                    </td>
                    <td>{item ? item.price : "N/A"}</td>
                    <td>
                        {item ? (
                            <button className="btn btn-danger" onClick={() => handleRemoveProduct(index)}>Remove</button>
                        ) : null}
                        {index === orderItems.length - 1 && (
                            <button className="btn btn-success" onClick={addNewRow}>+</button>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

    {/* Context Menu for Product Selection */}
    {contextMenu && contextMenu.rowIndex !== null && (
       <div ref={contextMenuRef}
       style={{
           position: 'absolute',
           top: contextMenu.y,
           left: contextMenu.x,
           backgroundColor: '#ffffff',
           border: '2px solid #007bff',
           boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
           padding: '10px',
           zIndex: 2050,
           borderRadius: '5px',
           maxHeight: '250px', // Limit the height
           overflowY: 'auto', // Enable scroll for more than 6 products
       }}>
        
        <h4 className="fw-bold" style={{ color: '#007bff' }}>Select a Product</h4>
        {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
                <div
                    key={product.id}
                    onClick={() => handleProductClick(product, contextMenu.rowIndex)}
                    style={{
                        padding: '5px',
                        cursor: 'pointer',
                        color: '#343a40',
                        display: 'flex', // flexbox to align image and text
                        alignItems: 'center', // align image and text vertically
                    }}
                 >
                    {/* Product Image */}
                    <img
                        src={`/storage/${product.image}`} // Assuming 'image_url' is the key for the image
                        alt={product.product_name}
                        style={{
                            width: '30px', // Image width set to 30px (can be adjusted)
                            height: '30px', // Image height set to 30px (can be adjusted)
                            marginRight: '10px', // Space between image and text
                            borderRadius: '3px', // Optional: to make the image round
                        }}
                    />
                    {/* Product Name */}
                    <span style={{ fontWeight: 'bold' }}>({product.product_code}) {product.product_name}</span>
                </div>
            ))
        ) : (
            <div style={{ color: '#dc3545' }}>No products available</div>
        )}
     </div>  
      
     )}

    {/* Total and Payment Section */}
    <p className="fw-bold" style={{ color: '#17a2b8' }}>Total Quantity: {totalQuantity}</p>
    <p className="fw-bold" style={{ color: '#6f42c1' }}>Total Price: {totalPrice}</p>
    {extraAmountChecked && (
        <p className="fw-bold" style={{ color: '#fd7e14' }}>Discount Price: {totalPrice - totalWithExtraAmount }</p>
    )}
    
    {previousDueAmount > 0 && <p className="fw-bold" style={{ color: '#e83e8c' }}>Previous Due Amount: {previousDueAmount}</p>}
    {grandTotal > 0 && <p className="fw-bold" style={{ color: '#198754' }}>Grand Total With Due And without Discount Price: {grandTotal}</p>}

    {/* Extra Amount Checkbox */}
    <div className="mb-3">
    <label className="form-check-label" style={{ display: 'flex', alignItems: 'center' }}>
        <input
            type="checkbox"
            className="form-check-input"
            checked={extraAmountChecked}
            onChange={(e) => setExtraAmountChecked(e.target.checked)}
            style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#20c997', // Sets the checkmark color
                border: '2px solid #20c997', // Adds a custom border color
                borderRadius: '4px', // Rounds the checkbox corners slightly
            }}
        />
        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#20c997' }}>Discount</span>
    </label>
</div>


    {/* Extra Amount */}
    {extraAmountChecked && (
        <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: '#20c997' }}>Discount Amount (%):</label>
            <input
                type="number"
                className="form-control"
                value={extraAmount}
                onChange={(e) => setExtraAmount(parseFloat(e.target.value) || 0)}
                style={{ borderColor: '#20c997' }}
            />
        </div>
    )}

    {/* Paid Amount */}
    <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: '#6610f2' }}>Paid Amount:</label>
        <input
            type="number"
            className="form-control"
            value={paidAmount}
            onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
            style={{ borderColor: '#6610f2' }}
        />
    </div>


            <button className="btn btn-primary" onClick={handleSubmitOrder}>Submit Order</button><br/><br/>

           {/* Order Report Modal */}
           {showModal && orderReport && (
    <div className="modal show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="orderReportModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content" id="orderReportModalContent">
                <div className="modal-header" style={{ backgroundColor: '#6c757d', color: '#ffffff' }}>
                    <h5 className="modal-title" id="orderReportModalLabel">Order Report</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Customer Name: {orderReport.customer_name}</h5>
                    <p style={{ color: '#28a745', fontWeight: 'bold' }}>Address: {orderReport.customer_address}</p>
                    <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Phone: {orderReport.customer_phone}</p>
                    <p style={{ color: '#ffc107', fontWeight: 'bold' }}><strong>Products:</strong></p>
                    <ul>
                          {orderReport.products.map((product, index) => (
                           <li key={index} style={{ fontWeight: 'bold', color: '#343a40' }}>
                           {product.product_name} (Code: {product.product_code}, Quantity: {product.quantity}, Price: {product.price})
                           </li>
                        ))}
                     </ul>
                    <p style={{ color: '#17a2b8', fontWeight: 'bold' }}>Total Quantity: {orderReport.products.reduce((total, product) => total + product.quantity, 0)}</p>
                    <p style={{ color: '#6f42c1', fontWeight: 'bold' }}>Total Price: {orderReport.products.reduce((total, product) => total + product.price * product.quantity, 0)}</p>
                    <p style={{ color: '#fd7e14', fontWeight: 'bold' }}>Discount Price: {orderReport.discountPrice}</p>
                    <p style={{ color: '#20c997', fontWeight: 'bold' }}>Total Price after discount: {orderReport.products.reduce((total, product) => total + product.price * product.quantity, 0) - orderReport.discountPrice }</p>
                    <p style={{ color: '#e83e8c', fontWeight: 'bold' }}>Previous Due Amount: {orderReport.previousDueAmount}</p>
                    <p style={{ color: '#6610f2', fontWeight: 'bold' }}>Paid Amount: {orderReport.paid_amount}</p>
                    <p style={{ color: '#198754', fontWeight: 'bold' }}>Grand Total: {orderReport.grandTotal}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handlePrintReport}>Print</button>
                </div>
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default OrderPage;
