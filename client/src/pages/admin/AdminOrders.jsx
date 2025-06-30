import React from "react";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import { useAuth } from "../../contexts/Auth.jsx";
import AdminMenu from "../../components/Layout/AdminMenu.jsx";

function AdminOrders() {
  const [auth] = useAuth();

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar */}
        <aside className="col-12 col-md-3 bg-light p-3">
          <AdminMenu />
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 p-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Welcome, {auth?.user?.name} 👋</h2>

              {/* Info row */}
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;
