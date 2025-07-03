import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "../contexts/Auth.jsx";

const API_BASE = import.meta.env.VITE_API || "";

export default function HomePage() {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/category/all-category`);
      setCategories(["All", ... (data.category || []).map(c => c.name)]);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/product/all-products`);
      setProducts(data.prod || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // filtered products
  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Home - My Store</title>
      </Helmet>
      <div className="container my-4">
        <div className="row">
          {/* Sidebar filter */}
          <aside className="col-md-3 mb-4">
            <div className="list-group">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Products grid */}
          <div className="col-md-9">
            <div className="row">
              {filtered.length ? (
                filtered.map(product => (
                  <div key={product._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={product.image || '/placeholder.png'}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-muted small mb-1">{
                          product.category
                        }</p>
                        <p className="card-text flex-grow-1">
                          {product.description?.slice(0, 60) || 'No description'}...
                        </p>
                        <div>
                          <strong>$ {product.price?.toFixed(2)}</strong>
                        </div>
                        <button className="btn btn-success mt-3">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>No products found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
