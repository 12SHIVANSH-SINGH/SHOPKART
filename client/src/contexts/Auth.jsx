import axios from "axios";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  Children,
} from "react";

const AuthContext = createContext(); // pool to store the data

const AuthProvider = ({ children }) => {
  // wrapper so that everyone insider it can access the pool
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common['Authorization'] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const pareseData = JSON.parse(data);
      setAuth({
        user: pareseData.user,
        token: pareseData.token,
      });
    }
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
// custom hook
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
