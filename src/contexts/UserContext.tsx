
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, PermissionKey } from "@/types";
import { hasPermission as checkPermission } from "@/lib/permissions";

interface UserContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: PermissionKey) => boolean;
  // Add the missing properties
  isAuthenticated: boolean;
  loading: boolean;
  firebaseUser: User | null;
  signIn: (user: User) => void;
  users?: User[];
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
  // Add default values for the missing properties
  isAuthenticated: false,
  loading: false,
  firebaseUser: null,
  signIn: () => {}
});

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permission: PermissionKey) => {
    return checkPermission(currentUser, permission);
  };

  // For backward compatibility
  const signIn = login;
  const firebaseUser = currentUser;
  const isAuthenticated = !!currentUser;

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      hasPermission,
      isAuthenticated,
      loading,
      firebaseUser,
      signIn
    }}>
      {children}
    </UserContext.Provider>
  );
};
