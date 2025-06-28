import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Auth.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner.jsx";

export default function Private() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/userAuth", {
          headers: {
            Authorization: auth?.token,
          },
        });
        if (res.data?.ok) {
          setOk(true);
        } else {
          setOk(false);
          navigate("/signin"); // ⛔ force logout if token bad
        }
      } catch (err) {
        console.log("Auth check failed:", err);
        setOk(false);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      navigate("/signin");
    }
  }, [auth?.token, navigate]);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : null;
}
