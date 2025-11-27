// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function with real API integration + mock fallback
  const login = async (email, password) => {
    try {
      // Try real API first
      const response = await api.login(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        setCurrentUser(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      // Fallback to mock authentication if API is not available
      console.log('API not available, using mock authentication');
      return await mockLogin(email, password);
    }
  };

  // Mock login for development (your existing code)
  const mockLogin = async (email, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your backend
      const user = {
        id: 1,
        name: 'John Doe',
        email: email,
        userType: 'patient',
        memberSince: '2024-01-01'
      };
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-jwt-token'); // Add mock token for consistency
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  // Register function with real API integration + mock fallback
  const register = async (userData) => {
    try {
      // Try real API first
      const response = await api.register(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        setCurrentUser(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      // Fallback to mock registration if API is not available
      console.log('API not available, using mock registration');
      return await mockRegister(userData);
    }
  };

  // Mock register for development (your existing code)
  const mockRegister = async (userData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: Date.now(), // Mock ID
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        userType: userData.userType,
        memberSince: new Date().toISOString().split('T')[0]
      };
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-jwt-token'); // Add mock token for consistency
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
