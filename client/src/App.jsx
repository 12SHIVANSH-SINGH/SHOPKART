import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Policy from "./pages/Policy.jsx";
import Pagenotfound from "./pages/Pagenotfound.jsx";
import Signin from "./pages/authPages/Signin.jsx";
import Signup from "./pages/authPages/Signup.jsx";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/user/Dashboard.jsx";
import Private from "./components/Routes/Private.jsx";
import ForgotPassword from "./pages/authPages/ForgotPassword.jsx";
import Protected from "./components/Routes/Protected.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
function App() {
  return (
    <>
      <Routes>
        {/* Public routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="*" element={<Pagenotfound />} />
          <Route path="/dashboard" element={<Private />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/admindashboard" element={<Protected />}>
            <Route index element={<AdminDashboard />} />
          </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;
