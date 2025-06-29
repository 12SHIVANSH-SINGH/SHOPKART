import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../contexts/Auth.jsx";

function Signin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/auth/login`,
        { email, password: pass }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        
        // Create auth object with user and token
        const authData = {
          user: res.data.user,
          token: res.data.token
        };
        
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
        navigate("/dashboard");
          
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Log In
          </button>
          <button type="submit" className="btn w-100" onClick={() => navigate('/forgotPassword')}>
            Forgot Password ?
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signin;