import { createContext, useContext, useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const fetchUserData = localStorage.getItem("userData");

  const [userData, setUserData] = useState(
    fetchUserData && fetchUserData !== "undefined"
      ? JSON.parse(fetchUserData)
      : null
  );
  const login = (token, userData) => {
    setToken(token);
    setUserData(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  };
  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };
  const isUserLoggedIn = !!token;
  return (
    <AuthContext.Provider
      value={{ login, logout, token, userData, isUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
