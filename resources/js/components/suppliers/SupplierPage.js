import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    note: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages
  const [isFormVisible, setIsFormVisible] = useState(false); // To control form visibility

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('There was an error fetching the suppliers!', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSupplier) {
      setEditingSupplier({ ...editingSupplier, [name]: value });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/suppliers', newSupplier);
      setSuppliers([...suppliers, response.data]);
      setNewSupplier({
        name: '',
        address: '',
        phone: '',
        email: '',
        note: '',
      });
      setAlertMessage({ type: 'success', message: 'Supplier added successfully!' });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error('Error adding new supplier', error);
      setAlertMessage({ type: 'danger', message: 'This email is already taken!' });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/suppliers/${editingSupplier.id}`,
        editingSupplier
      );
      const updatedSuppliers = suppliers.map((supplier) =>
        supplier.id === editingSupplier.id ? response.data : supplier
      );
      setSuppliers(updatedSuppliers);
      setEditingSupplier(null);
      setAlertMessage({ type: 'success', message: 'Supplier updated successfully!' });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error('Error updating supplier', error);
      setAlertMessage({ type: 'danger', message: 'Error updating supplier!' });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      setAlertMessage({ type: 'success', message: 'Supplier deleted successfully!' });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting supplier', error);
      setAlertMessage({ type: 'danger', message: 'Error deleting supplier!' });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  if (isLoading) return <p>Loading suppliers...</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Suppliers</h1>

      {/* Show alert messages */}
      {alertMessage && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show`} role="alert">
          {alertMessage.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage(null)}></button>
        </div>
      )}

      {/* Add New Supplier Button */}
      <button 
        className="btn btn-info mb-4" 
        type="button" 
        onClick={() => setIsFormVisible(!isFormVisible)} // Toggle form visibility
      >
        Add New Supplier
      </button>

      {/* Conditionally Render the Add Supplier Form */}
      {isFormVisible && (
        <form onSubmit={handleAddSupplier} className="border p-4 rounded shadow-sm mb-4">
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Supplier Name"
              value={newSupplier.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={newSupplier.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={newSupplier.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={newSupplier.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <textarea
              name="note"
              className="form-control"
              placeholder="Note"
              value={newSupplier.note}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-success">Add Supplier</button>
        </form>
      )}

      {/* Form for editing an existing supplier */}
      {editingSupplier && (
        <div className="border p-4 rounded shadow-sm mb-4">
          <h2 className="text-warning">Edit Supplier</h2>
          <form onSubmit={handleEditSupplier}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Supplier Name"
                value={editingSupplier.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="contact"
                className="form-control"
                placeholder="Contact"
                value={editingSupplier.contact}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Address"
                value={editingSupplier.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Phone"
                value={editingSupplier.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={editingSupplier.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <textarea
                name="note"
                className="form-control"
                placeholder="Note"
                value={editingSupplier.note}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-warning">Update Supplier</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingSupplier(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Supplier list */}
      <h2 className="text-info">Supplier List</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.address}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td>
                <button className="btn btn-warning" onClick={() => setEditingSupplier(supplier)}>Edit</button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierPage;
