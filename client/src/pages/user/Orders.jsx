import React from "react";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import { useAuth } from "../../contexts/Auth.jsx";

function Orders() {
  const [auth] = useAuth();

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar */}
        <aside className="col-12 col-md-3 bg-light p-3">
          <UserMenu />
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 p-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Orders 👋</h2>
              <p className="card-text text-muted">
                Here’s your ShopKart account orders.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Orders;
