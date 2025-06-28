import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-body-tertiary text-center text-lg-start mt-auto py-3 border-top">
      <div className="container d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2 gap-lg-5">
        <span className="text-muted">&copy; 2025 ECOMMERCE. All rights reserved.</span>
        <div>
          <NavLink
            to="/policy"
            className={({ isActive }) =>
              !isActive
                ? "text-muted me-3 text-decoration-none"
                : "text-muted me-3 text-decoration-underline"
            }
          >
            Policy
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              !isActive
                ? "text-muted me-3 text-decoration-none"
                : "text-muted me-3 text-decoration-underline"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              !isActive
                ? "text-muted text-decoration-none"
                : "text-muted text-decoration-underline"
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
