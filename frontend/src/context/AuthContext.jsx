import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Backend now returns a flat object: { token, _id, name, email, isAdmin, subscribed }
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Helper: get auth header using stored token
  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};
