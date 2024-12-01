import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierPurchasePage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState([]);
  const [supplierSummary, setSupplierSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false); // State to handle showing input and update button
  const [newDueAmount, setNewDueAmount] = useState(""); // State to store the new due amount

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  const fetchSuppliers = async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/supplierspurchase', {
        params: { search }
      });
      setSuppliers(response.data.data);
    } catch (err) {
      setError("Error fetching suppliers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierDetails = async (supplierId) => {
    try {
      const response = await axios.get(`/api/supplierspurchase/${supplierId}/purchases`);
      setSupplierDetails(response.data);
      setSelectedSupplier(supplierId);
      setShowModal(true);
      fetchSupplierSummary(supplierId);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  const fetchSupplierSummary = async (supplierId) => {
    try {
      const response = await axios.get(`/api/supplierspurchase/${supplierId}/summary`);
      setSupplierSummary(response.data);
    } catch (error) {
      console.error("Error fetching supplier summary:", error);
    }
  };

  const printSummary = () => {
    const printContent = document.getElementById("summary").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f2f2f2; }
            .signature-section { margin-top: 40px; }
            .signature { border-top: 1px solid #000; width: 200px; display: inline-block; }
          </style>
        </head>
        <body>
          <div id="print-summary-content">${printContent}</div>
          <div class="signature-section"><br><br>
          <div class="signature"></div>
            <p>Manager's Signature:</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleDueAdjust = async (supplierId, adjustedAmount) => {
    try {
      // Adjusting the due amount by sending a PUT request
      await axios.put(`/api/supplierspurchase/${supplierId}/adjust_due`, {
        amount: adjustedAmount
      });
      fetchSupplierDetails(supplierId); // Refresh supplier details to reflect the changes
      setIsAdjusting(false); // Hide the input field after updating
      setNewDueAmount(""); // Reset the new due amount input
    } catch (error) {
      console.error("Error adjusting due amount:", error);
    }
  };

  const toggleAdjustDue = () => {
    setIsAdjusting((prev) => !prev); // Toggle the adjust due input visibility
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Supplier Purchases</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Action</th>
                <th>Adjust Due</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.address}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => fetchSupplierDetails(supplier.id)}
                    >
                      Show Details
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={toggleAdjustDue}
                    >
                      Adjust Due
                    </button>
                    {isAdjusting && selectedSupplier === supplier.id && (
                      <div className="d-flex mt-2">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="New Due Amount"
                          name="amount"
                          value={newDueAmount}
                          onChange={(e) => setNewDueAmount(e.target.value)}
                        />
                        <button
                          className="btn btn-success btn-sm ms-2"
                          onClick={() => {
                            handleDueAdjust(supplier.id, newDueAmount);
                          }}
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", maxHeight: "90vh", overflowY: "auto" }}
          tabIndex="-1"
          aria-labelledby="supplierDetailsModalLabel"
         
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ height: "80vh", overflowY: "auto" }}>
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Purchase Price</th>
                        <th>Total Price</th>
                        <th>Due Amount</th>
                        <th>Paid Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierDetails.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>{purchase.product_name}</td>
                          <td>{purchase.purchase_quantity}</td>
                          <td>{purchase.purchase_price}</td>
                          <td>{purchase.total_amount}</td>
                          <td>{purchase.due_bill_amount}</td>
                          <td>{purchase.payment_bill_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {supplierSummary && (
                  <div id="summary" className="mt-4 border p-4 bg-light rounded">
                    <h2>Summary for Supplier #{supplierSummary.supplier_name}</h2>
                    <ul className="list-group mb-3">
                      <li className="list-group-item">Supplier Name: {supplierSummary.supplier_name}</li>
                      <li className="list-group-item">Email: {supplierSummary.supplier_email}</li>
                      <li className="list-group-item">Phone Number: {supplierSummary.supplier_contact}</li>
                      <li className="list-group-item">Address: {supplierSummary.supplier_address}</li>
                      <li className="list-group-item">Total Products: {supplierSummary.total_products}</li>
                      <li className="list-group-item">Total Quantity: {supplierSummary.total_quantity}</li>
                      <li className="list-group-item">Total Paid Amount: {supplierSummary.total_paid}</li>
                      <li className="list-group-item">Total Due Amount: {supplierSummary.total_due}</li>
                    </ul>
                    <button className="btn btn-primary" onClick={printSummary}>Print Summary</button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPurchasePage;
