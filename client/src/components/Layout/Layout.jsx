import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
function Layout({ children }) {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <ToastContainer/>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
