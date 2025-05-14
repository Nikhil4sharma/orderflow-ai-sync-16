import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PermissionKey } from '@/types';

export interface UserContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  firebaseUser: any;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  loading: true,
  isAuthenticated: false,
  firebaseUser: null,
  signIn: async () => null,
  signOut: () => {},
  setCurrentUser: () => {},
  users: [],
  addUser: () => {},
  removeUser: () => {},
  updateUser: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Mock user data for demo purposes
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          department: 'Admin',
          role: 'Admin',
          permissions: ['view_orders', 'create_orders', 'update_orders', 'delete_orders'],
        },
        {
          id: '2',
          name: 'Sales User',
          email: 'sales@example.com',
          department: 'Sales',
          role: 'Staff',
          permissions: ['view_orders', 'create_orders'],
        },
        {
          id: '3',
          name: 'Design User',
          email: 'design@example.com',
          department: 'Design',
          role: 'Staff',
          permissions: ['view_orders'],
        },
      ];
      setUsers(mockUsers);
      setLoading(false);
    } else {
      // Firebase authentication state listener (replace with your actual Firebase logic)
      // const unsubscribe = auth.onAuthStateChanged(user => {
      //   setFirebaseUser(user);
      //   setCurrentUser(user ? {
      //     id: user.uid,
      //     name: user.displayName || 'User',
      //     email: user.email || '',
      //     department: 'Sales', // Replace with actual department
      //     role: 'Staff', // Replace with actual role
      //     permissions: ['view_orders'] // Replace with actual permissions
      //   } : null);
      //   setLoading(false);
      //   setIsAuthenticated(!!user);
      // });
      // return () => unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign-in for demo purposes
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      const mockUser = users.find(user => user.email === email);
      if (mockUser) {
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);
        return mockUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // Firebase sign-in (replace with your actual Firebase logic)
      // try {
      //   await auth.signInWithEmailAndPassword(email, password);
      //   setIsAuthenticated(true);
      // } catch (error) {
      //   console.error("Firebase sign-in error:", error);
      //   throw error;
      // }
    }
  };

  const signOut = () => {
    // Mock sign-out for demo purposes
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    } else {
      // Firebase sign-out (replace with your actual Firebase logic)
      // auth.signOut();
      // setIsAuthenticated(false);
    }
  };

  const logout = () => {
    signOut();
  };

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      loading,
      isAuthenticated,
      firebaseUser,
      signIn,
      signOut,
      setCurrentUser,
      users,
      addUser,
      removeUser,
      updateUser,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
