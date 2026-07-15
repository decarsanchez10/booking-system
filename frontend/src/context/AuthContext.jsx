import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem('obsidian_user');
    const savedToken = localStorage.getItem('obsidian_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const getRoleFromEmail = (email) => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('agent') || email.includes('support')) return 'agent';
    return 'user';
  };

  const login = (email, password, role = null) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // If a role is provided from the UI, use it. Otherwise derive from email.
          let assignedRole = role || getRoleFromEmail(email);
          if (email.includes('admin')) assignedRole = 'admin'; // Override if admin email
          
          const userData = {
            id: Date.now(),
            name: email.split('@')[0],
            email,
            role: assignedRole,
          };
          const token = 'jwt_mock_' + Date.now();
          localStorage.setItem('obsidian_user', JSON.stringify(userData));
          localStorage.setItem('obsidian_token', token);
          setUser(userData);
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const signup = (name, email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          // Allow explicit role setting for testing, otherwise derive from email
          const assignedRole = email.includes('admin') ? 'admin' 
                             : email.includes('agent') ? 'agent' 
                             : role;
          
          const userData = {
            id: Date.now(),
            name,
            email,
            role: assignedRole,
          };
          const token = 'jwt_mock_' + Date.now();
          localStorage.setItem('obsidian_user', JSON.stringify(userData));
          localStorage.setItem('obsidian_token', token);
          setUser(userData);
          resolve(userData);
        } else {
          reject(new Error('All fields are required'));
        }
      }, 800);
    });
  };

  const logout = () => {
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
