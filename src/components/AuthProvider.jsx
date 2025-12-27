import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null;

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === "ROLE_ADMIN",
      isUser: user?.role === "ROLE_USER",
    }}>
      {children}
    </AuthContext.Provider>
  );
};
