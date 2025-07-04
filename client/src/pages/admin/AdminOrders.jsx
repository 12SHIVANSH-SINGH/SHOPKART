import React, { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../contexts/Auth.jsx"
import AdminMenu from "../../components/Layout/AdminMenu.jsx"

const API_BASE = import.meta.env.VITE_API || ""

function AdminOrders() {
  const [auth] = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/v1/order/get-all-item`, {
          headers: { Authorization: auth.token },
        })
        const successOrders = (data.orders || []).filter(o => o.status === "success")
        setOrders(successOrders)
      } catch (err) {
        console.error("Failed to load orders", err)
      }
    }

    if (auth?.token) fetchOrders()
  }, [auth])

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 bg-light p-3">
          <AdminMenu />
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 p-4 overflow-auto">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Successful Orders ✅</h2>
              <p className="text-muted mb-4">
                Showing all orders with payment <strong>success</strong>.
              </p>

              {orders.length === 0 ? (
                <p>No successful orders found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User ID</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr key={order._id}>
                          <td>{i + 1}</td>
                          <td>{order.user?._id || order.user || "Unknown"}</td>
                          <td>{order.item}</td>
                          <td>{order.quantity}</td>
                          <td>${(order.price * order.quantity).toFixed(2)}</td>
                          <td>{new Date(order.updatedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminOrders
