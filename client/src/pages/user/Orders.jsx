import React, { useState, useEffect } from "react";
import axios from "axios";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import { useAuth } from "../../contexts/Auth.jsx";

const API_BASE = import.meta.env.VITE_API || "";

export default function Orders() {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/product/all-products`)
      .then(({ data }) => {
        const map = {};
        (data.prod || []).forEach((p) => {
          map[p.name] = p;
        });
        setProductsMap(map);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
   if (!auth?.token) return
    axios
      .get(`${API_BASE}/api/v1/order/user-orders/${auth.user._id}`, {
        headers: { Authorization: `${auth.token}` },
      })
      .then(({ data }) => setOrders(data.orders || []))
      .catch(console.error)
  }, [auth])

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <aside className="col-12 col-md-3 bg-light p-3">
          <UserMenu />
        </aside>
        <main className="col-12 col-md-9 p-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">My Orders</h2>
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const p = productsMap[o.item] || {};
                    const price = p.price || 0;
                    const subtotal = price * o.quantity;
                    return (
                      <tr key={o._id}>
                        <td>{o.item}</td>
                        <td>${price.toFixed(2)}</td>
                        <td>{o.quantity}</td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>
                          <span
                            className={
                              o.status == "pending"
                                ? "badge bg-warning text-dark"
                                : o.status == "success"
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        You have no orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
