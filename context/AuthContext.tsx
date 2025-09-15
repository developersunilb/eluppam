'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { saveActiveUser, getActiveUser, clearActiveUser, ActiveUserSession } from '@/lib/db';

interface AuthContextType {
  user: ActiveUserSession | null; // Changed from userId to user object
  isLoggedIn: boolean;
  login: (userId: string, username: string, email?: string) => Promise<void>; // Updated signature
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ActiveUserSession | null>(null); // Changed from userId to user
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const activeUser = await getActiveUser(); // Get full user object
      setUser(activeUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = useCallback(async (userId: string, username: string, email?: string) => {
    setLoading(true);
    const newUser: ActiveUserSession = { id: 'activeUser', userId, username, email };
    await saveActiveUser(userId, username, email);
    setUser(newUser);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await clearActiveUser();
    setUser(null);
    setLoading(false);
  }, []);

  const value = {
    user,
    isLoggedIn: !!user, // Derived from user object
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
