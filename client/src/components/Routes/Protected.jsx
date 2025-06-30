import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Auth.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner.jsx";

export default function Protected() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      // If no token exists, redirect immediately
      if (!auth?.token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/api/v1/auth/adminAuth`, {
          headers: {
            Authorization: `${auth.token}`,
          },
        });
        
        if (res.data?.ok) {
          setOk(true);
        } else {
          // Handle invalid response
          console.error("Invalid auth response:", res.data);
          navigate("/dashboard");
        }
      } catch (err) {
        // Handle specific error cases
        console.error("Auth check failed:", err);
        
        if (err.response?.status === 401) {
          console.log("Token is invalid or expired");
        } else {
          console.log("Network or server error");
        }
        
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent rapid fire requests
    const timer = setTimeout(authCheck, 100);
    return () => clearTimeout(timer);
  }, [auth?.token, navigate]);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : null;
}