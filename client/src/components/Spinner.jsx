import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Spinner() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1);
    }, 1000); // run every 1 second

    // when count reaches 0, redirect
    if (count === 0) {
      navigate("/dashboard");
    }

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, [count, navigate]); // 🔁 run whenever count changes

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center flex-column"
    >
      <div className="spinner-border" role="status"></div>
      <p className="mt-3">Redirecting in {count} seconds...</p>
    </div>
  );
}

export default Spinner;
