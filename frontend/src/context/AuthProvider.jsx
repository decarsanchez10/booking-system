import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import api, { getApiErrorMessage } from '../lib/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('obsidian_user');
    const savedToken = localStorage.getItem('obsidian_token');

    const restoreSession = async () => {
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        localStorage.setItem('obsidian_user', JSON.stringify(data));
        setUser(data);
      } catch {
        localStorage.removeItem('obsidian_user');
        localStorage.removeItem('obsidian_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('obsidian_user');
      }
    }

    restoreSession();
  }, []);

  const persistSession = (userData, token) => {
    localStorage.setItem('obsidian_user', JSON.stringify(userData));
    localStorage.setItem('obsidian_token', token);
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return persistSession(data.user, data.token);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Invalid credentials.'));
    }
  };

  const signup = async (name, email, password, role = 'user') => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: password,
        role,
      });
      return persistSession(data.user, data.token);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to create account.'));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Expired tokens are cleared locally below.
    }
    localStorage.removeItem('obsidian_user');
    localStorage.removeItem('obsidian_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
