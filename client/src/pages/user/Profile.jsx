import React from "react";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import { useAuth } from "../../contexts/Auth.jsx";

function Profile() {
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
              <h2 className="card-title">Profile 👋</h2>
              <p className="card-text text-muted">
                Here’s your ShopKart account overview.
              </p>

              {/* Info row */}
              <div className="row mt-4">
                <div className="col-12 col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Email</small>
                    <div>{auth?.user?.email || "Not Provided"}</div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Phone</small>
                    <div>{auth?.user?.phone || "Not Provided"}</div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Address</small>
                    <div>{auth?.user?.address || "Not Provided"}</div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 mb-3">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted">Name</small>
                    <div>{auth?.user?.name || "Not Provided"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
