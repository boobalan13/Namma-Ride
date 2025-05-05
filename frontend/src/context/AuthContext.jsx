import { createContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, register as registerApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch (err) {
      sessionStorage.removeItem('token');
      setError(err.response?.data?.message || 'Error loading user');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      sessionStorage.setItem('token', res.data.token);
      await loadUser();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (userData) => {
    try {
      const res = await loginApi(userData);
      sessionStorage.setItem('token', res.data.token);
      await loadUser();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 