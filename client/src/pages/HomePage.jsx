import React from "react";
import Layout from "../components/Layout/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "../contexts/Auth.jsx";
function HomePage() {
  const [auth, setAuth] = useAuth();
  return (
    <>
        <h1>Homepage</h1>
        <pre>{JSON.stringify(auth,null,5)}</pre>
    </>
  );
}

export default HomePage;
