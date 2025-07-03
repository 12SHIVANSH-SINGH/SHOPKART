import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from '../../components/Layout/AdminMenu.jsx';
import { toast } from 'react-toastify';

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    shipping: false,
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API;

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${apiBase}/api/v1/category/all-category`);
      setCategories(data.category || []);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${apiBase}/api/v1/product/all-products`);
      setProducts(data.prod || []);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value, type, checked, files } = target;
    if (type === 'checkbox') setFormData(prev => ({ ...prev, [name]: checked }));
    else if (type === 'file') setFormData(prev => ({ ...prev, image: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (val != null) payload.append(key, val);
      });
    
      if (editingId) {
        payload.append('id', editingId);
        await axios.post(`${apiBase}/api/v1/product/update-product`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${apiBase}/api/v1/product/create-product`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setFormData({ name:'', description:'', price:'', category:'', quantity:'', shipping:false, image:null });
      setEditingId(null);
      fetchProducts();
      toast.success("SUCCESS");
    } catch (err) {
      console.error('Error saving product', err);
       toast.error("SOMETHING WENT WRONG");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = prod => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      quantity: prod.quantity,
      shipping: prod.shipping,
      image: null
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${apiBase}/api/v1/product/delete-product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  return (
    <div className="row m-0" style={{ minHeight: '100vh' }}>
      <div className="col-md-3 p-0 bg-light">
        <AdminMenu />
      </div>

      <div className="col-md-9 p-4">
        <h2 className="mb-4">Manage Products</h2>
        <form className="mb-4" onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: '800px' }}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="form-control" rows="3" />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="form-select">
                <option value="">--Select--</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Quantity</label>
              <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} required className="form-control" />
            </div>
          </div>
          <div className="mb-3 form-check">
            <input name="shipping" checked={formData.shipping} onChange={handleChange} type="checkbox" className="form-check-input" id="shippingCheck" />
            <label htmlFor="shippingCheck" className="form-check-label">Requires Shipping</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input name="image" onChange={handleChange} type="file" accept="image/*" className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setFormData({ name:'', description:'', price:'', category:'', quantity:'', shipping:false, image:null }); }}>
              Cancel
            </button>
          )}
        </form>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Price</th><th>Category</th><th>Qty</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr key={prod._id}>
                  <td>{idx+1}</td>
                  <td>{prod.name}</td>
                  <td>{prod.price}</td>
                  <td>{prod.category}</td>
                  <td>{prod.quantity}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
