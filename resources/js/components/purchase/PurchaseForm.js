import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PurchaseForm() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        product_id: "",
        supplier_id: "",
        category: "",
        purchase_quantity: 1,
        purchase_price: 0,
        total_amount: 0,
        purchase_date: "",
        payment_bill_amount: 0,
        due_bill_amount: 0,
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("/api/purchases/create").then((response) => {
            setProducts(response.data.products);
            setSuppliers(response.data.suppliers);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => {
            const updatedFormData = { ...prevState, [name]: value };

            if (name === "purchase_quantity" || name === "purchase_price") {
                updatedFormData.total_amount =
                    updatedFormData.purchase_quantity * updatedFormData.purchase_price;
                updatedFormData.due_bill_amount =
                    updatedFormData.total_amount - parseFloat(updatedFormData.payment_bill_amount || 0);
            }

            if (name === "payment_bill_amount") {
                updatedFormData.due_bill_amount =
                    updatedFormData.total_amount - parseFloat(value || 0);
            }

            return updatedFormData;
        });
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;

        setFormData((prevState) => ({
            ...prevState,
            product_id: productId,
            category: "",
            purchase_price: 0,
            total_amount: 0,
        }));

        if (productId) {
            axios.get(`/api/purchases/product/${productId}`).then((response) => {
                setFormData((prevState) => ({
                    ...prevState,
                    category: response.data.category,
                    purchase_price: response.data.buying_price,
                }));
            });
        }
    };

    const handleSupplierChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            supplier_id: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post("/api/purchases", formData)
            .then((response) => {
                setMessage(response.data.message);
                setFormData({
                    product_id: "",
                    supplier_id: "",
                    category: "",
                    purchase_quantity: 1,
                    purchase_price: 0,
                    total_amount: 0,
                    purchase_date: "",
                    payment_bill_amount: 0,
                    due_bill_amount: 0,
                });
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error.message);
                setMessage("Error creating purchase.");
            });
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white text-center">
                    <h5>Add New Purchase</h5>
                </div>
                <div className="card-body">
                    {message && <p className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Product:</label>
                                <select
                                    className="form-select"
                                    name="product_id"
                                    value={formData.product_id}
                                    onChange={handleProductChange}
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Category:</label>
                                <input type="text" className="form-control" value={formData.category} readOnly />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Supplier:</label>
                                <select
                                    className="form-select"
                                    name="supplier_id"
                                    value={formData.supplier_id}
                                    onChange={handleSupplierChange}
                                    required
                                >
                                    <option value="">Select a supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Quantity:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="purchase_quantity"
                                    value={formData.purchase_quantity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Buying Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="purchase_price"
                                    value={formData.purchase_price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Total Amount:</label>
                                <input type="number" className="form-control" value={formData.total_amount} readOnly />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Payment Amount:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="payment_bill_amount"
                                    value={formData.payment_bill_amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Due Amount:</label>
                                <input type="number" className="form-control" value={formData.due_bill_amount} readOnly />
                            </div>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "5vh" }}>
    <div className="col-md-6 mb-3">
        <div className="input-group shadow-sm">
            <span className="input-group-text bg-primary text-white">
                <i className="bi bi-calendar3"></i>
            </span>
            <input
                type="date"
                className="form-control"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                required
                placeholder="Select Purchase Date"
                style={{ fontSize: "0.9rem", padding: "8px" }}
            />
        </div>
    </div>
</div>

                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-4">
                            Add Purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PurchaseForm;
