import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PurchasesList() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all purchases on mount
    useEffect(() => {
        axios
            .get("/api/purchasesList") // Your API endpoint for fetching all purchases
            .then((response) => {
                setPurchases(response.data.purchases);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching purchases:", err);
                setError("Error fetching purchase data.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Purchase List</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && !error && purchases.length === 0 && (
                <p className="alert alert-info">No purchases found.</p>
            )}
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Supplier</th>
                        <th>purchase_price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Payment Amount</th>
                        <th>Due Amount</th>
                        <th>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                            <td>{purchase.product_name}</td>
                            <td>{purchase.supplier_name}</td>
                            <td>{purchase.purchase_price}</td>
                            <td>{purchase.purchase_quantity}</td>
                            <td>{purchase.total_amount}</td>
                            <td>{purchase.payment_bill_amount}</td>
                            <td>{purchase.due_bill_amount}</td>
                            <td>{purchase.purchase_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PurchasesList;
