import React, { useState, useEffect } from "react"
import axios from "axios"
import { Helmet } from "react-helmet"
import { useAuth } from "../../contexts/Auth.jsx"
import UserMenu from "../../components/Layout/UserMenu.jsx";
const API_BASE = import.meta.env.VITE_API || ""

export default function DashboardPage() {
  const [auth] = useAuth()
  const [orders, setOrders] = useState([])
  const [productsMap, setProductsMap] = useState({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!auth?.token) return
    axios
      .get(`${API_BASE}/api/v1/order/user-orders/${auth.user._id}`, {
        headers: { Authorization: `${auth.token}` },
      })
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
  }, [auth])

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/product/all-products`)
      .then(({ data }) => {
        const map = {}
        data.prod.forEach(p => {
          map[p.name] = p
        })
        setProductsMap(map)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    let sum = 0
    orders.forEach(o => {
      const p = productsMap[o.item]
      if (p) sum += p.price * o.quantity
    })
    setTotal(sum)
  }, [orders, productsMap])

  const handleUpdate = async (slug, qty) => {
    const url = `${API_BASE}/api/v1/order/update-item/${slug}/${auth.user._id}`
    const headers = { Authorization: `${auth.token}` }
    if (qty < 1) {
      await axios.delete(
        `${API_BASE}/api/v1/order/delete-item/${slug}/${auth.user._id}`,
        { headers }
      )
      setOrders(o => o.filter(x => x.item !== productsMap[slug]?.name))
    } else {
      const { data } = await axios.put(url, { quantity: qty }, { headers })
      setOrders(o =>
        o.map(x => (x._id === data.order._id ? data.order : x))
      )
    }
    
  }
  

  return (
    <>
      <Helmet>
        <title>Dashboard - My Orders</title>
      </Helmet>
      <>

          {/* Left: user menu */}
          <aside className="col-md-3 mb-4">
            <UserMenu />
          </aside>

        <div className="container my-4">
          <h2 className="mb-4">My Cart</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const p = productsMap[o.item] || {}
                return (
                  <tr key={o._id}>
                    <td>{p.name}</td>
                    <td>${p.price?.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            handleUpdate(p.slug, o.quantity - 1)
                          }
                        >
                          –
                        </button>
                        <span className="mx-2">{o.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            handleUpdate(p.slug, o.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(p.price * o.quantity)?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleUpdate(p.slug, 0)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="3" className="text-end">
                  Total:
                </th>
                <th>${total.toFixed(2)}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    </>
  )
}
