import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vg_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          } else {
             localStorage.removeItem('vg_token');
          }
        } catch (err) {
          localStorage.removeItem('vg_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      localStorage.setItem('vg_token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('vg_token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('vg_token');
  };

  const updateUserProfile = async (newData) => {
    try {
      if (newData.avatarUrl) {
        await api.put('/users/avatar', { avatarUrl: newData.avatarUrl });
      }
      
      const { name, phone, department, plantLocation } = newData;
      const patchData = { name, phone, department, plantLocation };
      
      // Ensure we only push defined updates, stripping empty keys
      Object.keys(patchData).forEach(key => patchData[key] === undefined && delete patchData[key]);

      const res = await api.patch('/users/me', patchData);
      
      if (res.data.success) {
        const updated = { ...user, ...res.data.user };
        setUser(updated);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Revert logically or notify
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
