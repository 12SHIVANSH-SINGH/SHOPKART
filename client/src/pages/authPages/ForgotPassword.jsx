import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setPass] = useState("");
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/auth/forgotPassword`,
        { email, newPassword, answer }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);

        // Create auth object with user and token

        navigate("/signin"); // Redirect to dashboard instead of home
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
        <h2 className="text-center mb-4 text-primary fw-bold">Forgot Password</h2>
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
              type="text"
              className="form-control"
              placeholder="Enter Your Favourite Number"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Change Password
          </button>

        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
