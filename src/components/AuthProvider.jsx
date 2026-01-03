import { createContext, useContext, useEffect, useState } from "react";
import api from "../components/Axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const decoded = token ? jwtDecode(token) : null;
  const role = decoded?.role;

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/user-detail/me");

      setUser({
        ...res.data,
        role,
      });

      
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...res.data, role })
      );
    } catch {
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        isAdmin: role === "ROLE_ADMIN",
        isUser: role === "ROLE_USER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
