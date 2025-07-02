import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu.jsx";

function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/category/all-category`
      );

      setCategories(data?.category || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API}/api/v1/category/update-category/${editingId}`,
          { name }
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API}/api/v1/category/create-category`, { name});
      }
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  // Edit a category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat._id);
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API}/api/v1/category/delete-category/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
       <div className="col-md-3 p-0 bg-light">
        <AdminMenu />
      </div>
      {/* Main Content */}
      <div className="container-fluid p-4">
        <h2 className="mb-4">Manage Categories</h2>

        {/* Form */}
        <form className="mb-4 w-50" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories || []).map((cat, idx) => (
              <tr key={cat._id}>
                <td>{idx + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategory;
