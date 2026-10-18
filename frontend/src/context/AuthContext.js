import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ej_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("ej_user", JSON.stringify(user));
  }, [user]);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("ej_token", data.access_token);
    localStorage.setItem("ej_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    localStorage.setItem("ej_token", data.access_token);
    localStorage.setItem("ej_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ej_token");
    localStorage.removeItem("ej_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);