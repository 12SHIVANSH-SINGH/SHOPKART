import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Profile", to: "/dashboard/profile", emoji: "👤" },
  { label: "Orders", to: "/dashboard/orders", emoji: "🛒" },
];

function UserMenu() {
  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
      <h4 className="text-center fw-bold mb-4 text-primary d-flex justify-content-center align-items-center gap-2">
        
        <NavLink
          to="/dashboard"
          className="text-decoration-none text-primary ms-2"
        >
          Dashboard
        </NavLink>
      </h4>

      <div className="list-group">
        {menuItems.map(({ label, to, emoji }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `list-group-item list-group-item-action d-flex align-items-center ${
                isActive ? "active bg-primary text-white fw-semibold" : ""
              }`
            }
          >
            <span className="me-2">{emoji}</span> {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default UserMenu;
