import React from "react";
import { NavLink } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-3">Oops! Page Not Found</p>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <NavLink to="/" className="btn btn-primary px-4 py-2">
        Go Home
      </NavLink>
    </div>
  );
}

export default PageNotFound;
