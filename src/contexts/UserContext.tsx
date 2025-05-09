
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import { toast } from 'sonner';

type UserContextType = {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  users: User[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  firebaseUser: null,
  users: [],
  loading: true,
  error: null,
  isAuthenticated: false,
  signIn: async () => {},
  logout: async () => {},
  addUser: async () => {},
  updateUser: async () => {},
  removeUser: async () => {},
  hasPermission: () => false,
});

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!firebaseUser;

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Get the user's profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            // User profile exists in Firestore
            const userData = userDoc.data() as User;
            setCurrentUser(userData);
          } else {
            // User is authenticated but has no profile in Firestore
            console.warn("User authenticated but no profile found in Firestore");
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user profile");
        }
      } else {
        // User is not authenticated
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for users collection changes
  useEffect(() => {
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      setUsers(usersList);
    }, (err) => {
      console.error("Error listening to users collection:", err);
      setError("Failed to load users");
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        toast.error("Invalid email or password");
      } else {
        toast.error("Failed to login");
      }
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
      throw err;
    }
  };

  // Add a new user
  const addUser = async (user: User): Promise<void> => {
    try {
      // Add to Firestore
      await setDoc(doc(db, 'users', user.id), user);
      toast.success("User created successfully");
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to create user");
      toast.error("Failed to create user");
      throw err;
    }
  };

  // Update an existing user
  const updateUser = async (user: User): Promise<void> => {
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
      toast.success("User updated successfully");
      
      // If the current user is being updated, update the current user state
      if (currentUser && currentUser.id === user.id) {
        setCurrentUser(user);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
      toast.error("Failed to update user");
      throw err;
    }
  };

  // Remove a user
  const removeUser = async (userId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to delete user");
      toast.error("Failed to delete user");
      throw err;
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!currentUser || !currentUser.permissions) {
      return false;
    }
    return currentUser.permissions.includes(permission as any);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        firebaseUser,
        users,
        loading,
        error,
        isAuthenticated,
        signIn,
        logout,
        addUser,
        updateUser,
        removeUser,
        hasPermission
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
