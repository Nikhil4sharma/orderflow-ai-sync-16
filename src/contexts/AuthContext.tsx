
import React, { createContext, useContext, useEffect } from 'react';
import { useUsers } from './UserContext';
import { useNavigate } from 'react-router-dom';

// This is now a wrapper around UserContext for backward compatibility
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const { currentUser, firebaseUser, loading, signIn, logout, isAuthenticated } = useUsers();
  return {
    currentUser: firebaseUser,
    loading,
    signIn,
    logout,
    isAuthenticated
  };
}
