import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:8000/api/categories');
        setCategories(response.data);
    };

    const addCategory = async () => {
        await axios.post('http://localhost:8000/api/categories', { name: newCategory });
        setNewCategory("");
        fetchCategories();
    };

    const deleteCategory = async (id) => {
        await axios.delete(`http://localhost:8000/api/categories/${id}`);
        fetchCategories();
    };

    const startEdit = (category) => {
        setEditing(category.id);
        setEditName(category.name);
    };

    const saveEdit = async (id) => {
        await axios.put(`http://localhost:8000/api/categories/${id}`, { name: editName });
        setEditing(null);
        setEditName("");
        fetchCategories();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Category Management</h1>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addCategory}>Add Category</button>
            </div>

            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editing === category.id ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={() => saveEdit(category.id)}>Save</button>
                                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <span>{category.name}</span>
                                <div>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(category)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(category.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
