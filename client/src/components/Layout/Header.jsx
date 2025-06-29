import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // Ensure logo.png exists in /assets
import { useAuth } from "../../contexts/Auth.jsx";
import { toast } from "react-toastify";

function Header() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isAdmin = auth?.user?.role === 1;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm sticky-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="ecommerce-logo"
            width="40"
            height="40"
            className="me-2 rounded-circle"
          />
          <span className="fw-bold fs-5">SHOPKART</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="dropdown ms-3">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {auth?.user ? auth.user.name : "Join Us"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
              {!auth?.user ? (
                <>
                  <li>
                    <NavLink to="/signup" className="dropdown-item">
                      Signup
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/signin" className="dropdown-item">
                      Signin
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className="dropdown-item">
                      Dashboard
                    </NavLink>
                  </li>
                  {isAdmin && (
                    <li>
                      <NavLink to="/adminDashboard" className="dropdown-item">
                        Admin Panel
                      </NavLink>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
