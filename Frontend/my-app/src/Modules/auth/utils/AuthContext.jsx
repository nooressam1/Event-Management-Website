// src/Modules/auth/utils/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL ?? "";

  const signup = async (username, email, password) => {
    const res = await axios.post(`${API}/api/auth/signup`, { name: username, email, password }, { withCredentials: true });
    setUser(res.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
      setUser(res.data.user ?? null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return <AuthContext.Provider value={{ user, signup, login, logout, loading }}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => useContext(AuthContext);