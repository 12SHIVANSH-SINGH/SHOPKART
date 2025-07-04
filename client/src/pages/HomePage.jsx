import React, { useState, useEffect } from "react"
import axios from "axios"
import { Helmet } from "react-helmet"
import { useAuth } from "../contexts/Auth.jsx"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API || ""

export default function HomePage() {
  const [auth] = useAuth()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [cartMap, setCartMap] = useState({})
  const [selectedCategory, setSelectedCategory] = useState("All")
  const navigate = useNavigate()

  // load categories & products
  useEffect(() => {
    ;(async () => {
      try {
        const [{ data: catRes }, { data: prodRes }] = await Promise.all([
          axios.get(`${API_BASE}/api/v1/category/all-category`),
          axios.get(`${API_BASE}/api/v1/product/all-products`),
        ])
        setCategories(["All", ...(catRes.category || []).map(c => c.name)])
        setProducts(prodRes.prod || [])
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  // load user cart
  useEffect(() => {
    if (!auth?.token) return
    axios
      .get(`${API_BASE}/api/v1/order/user-orders/${auth.user._id}`, {
        headers: { Authorization: auth.token },
      })
      .then(({ data }) => {
        const m = {}
        data.orders.forEach(o => {
          m[o.item] = {
            qty: o.quantity,
            slug: o.slug,
            price: typeof o.price === 'number' ? o.price : 0,
          }
        })
        setCartMap(m)
      })
      .catch(console.error)
  }, [auth])

  const handleAdd = async product => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/v1/order/add-item/${product.slug}/${auth.user._id}`,
        {},
        { headers: { Authorization: auth.token } }
      )
      setCartMap(m => ({
        ...m,
        [product.name]: {
          qty: data.order.quantity,
          slug: product.slug,
          price: product.price || 0,
        },
      }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdate = async (name, slug, newQty) => {
    const headers = { Authorization: auth.token }
    try {
      if (newQty < 1) {
        await axios.delete(
          `${API_BASE}/api/v1/order/delete-item/${slug}/${auth.user._id}`,
          { headers }
        )
        setCartMap(m => {
          const c = { ...m }
          delete c[name]
          return c
        })
      } else {
        const { data } = await axios.put(
          `${API_BASE}/api/v1/order/update-item/${slug}/${auth.user._id}`,
          { quantity: newQty },
          { headers }
        )
        setCartMap(m => ({
          ...m,
          [name]: {
            qty: data.order.quantity,
            slug,
            price: m[name]?.price || 0,
          },
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter(p => p.category === selectedCategory)

  const cartItemCount = Object.values(cartMap).reduce((acc, cur) => acc + cur.qty, 0)

  return (
    <>
      <Helmet>
        <title>Home - My Store</title>
      </Helmet>
      <div className="container my-4">
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-outline-dark position-relative"
            onClick={() => navigate("/dashboard")}
          >
            🛒 Cart
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="row">
          {/* Products */}
          <div className="col-lg-12 mb-4">
            <div className="mb-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-outline-primary me-2 mb-2 ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="row">
              {filtered.map(product => {
                const inCart = cartMap[product.name] || { qty: 0 }
                return (
                  <div key={product._id} className="col-12 col-sm-6 col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={product.image || "/placeholder.png"}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="text-muted small">{product.category}</p>
                        <p className="flex-grow-1 small">
                          {product.description?.slice(0, 60) || "No description"}...
                        </p>
                        <strong>${(product.price || 0).toFixed(2)}</strong>
                        {inCart.qty === 0 ? (
                          <button
                            className="btn btn-success mt-3"
                            onClick={() => handleAdd(product)}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="d-flex align-items-center mt-3">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleUpdate(product.name, product.slug, inCart.qty - 1)}
                            >
                              –
                            </button>
                            <span className="mx-2">{inCart.qty}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleUpdate(product.name, product.slug, inCart.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && <p className="text-center">No products found.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
