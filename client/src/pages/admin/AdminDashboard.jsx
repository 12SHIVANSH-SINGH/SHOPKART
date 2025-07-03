import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import { useAuth } from "../../contexts/Auth.jsx";
import AdminMenu from "../../components/Layout/AdminMenu.jsx";

// Base URL from env
const API_BASE = import.meta.env.VITE_API || "";

export default function AdminDashboard() {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/v1/product/all-products`
      );
      setProducts(data.prod || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Left Sidebar */}
        <aside className="col-12 col-md-3 bg-light p-3">
          <AdminMenu />
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 p-4 pb-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title">Welcome, {auth?.user?.name} 👋</h2>

              {/* Info Row */}
              <div className="row mt-4">
                <div className="col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Email</small>
                    <div>{auth?.user?.email || "Not Provided"}</div>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Name</small>
                    <div>{auth?.user?.name || "Not Provided"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row">
            {products.length ? (
              products.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.image || "/placeholder.png"}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text flex-grow-1">
                        {product.description?.slice(0, 60) || "No description"}...
                      </p>
                      <div>
                        <strong>$ {product.price?.toFixed(2) || "0.00"}</strong>
                      </div>
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
        </main>
      </div>
    </div>
  );
}