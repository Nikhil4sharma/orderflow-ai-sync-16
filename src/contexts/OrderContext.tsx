
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, User, OrderStatus, StatusUpdate } from "@/types";
import { getMockOrders } from "@/lib/mock-data";

// Define the context type
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (updatedOrder: Order) => void;
  deleteOrder: (orderId: string) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => void;
  verifyOrder: (orderId: string) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  canUserSeeElement: (department: string, element: string) => boolean;
}

// Create a context with an empty default value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : getMockOrders();
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save orders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  
  // Save authentication state and user to local storage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [isAuthenticated, currentUser]);

  // Add a new order
  const addOrder = (order: Order) => {
    setOrders(prevOrders => [...prevOrders, order]);
  };

  // Update an existing order
  const updateOrder = (updatedOrder: Order) => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  // Delete an order
  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };
  
  // Add a status update to an order
  const addStatusUpdate = (orderId: string, statusUpdate: Partial<StatusUpdate>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        // Create new status update
        const newUpdate: StatusUpdate = {
          id: `status-${Date.now()}`,
          orderId: orderId,
          timestamp: new Date().toISOString(),
          department: statusUpdate.department || currentUser?.department || "Admin",
          status: statusUpdate.status || order.status,
          remarks: statusUpdate.remarks || "",
          updatedBy: currentUser?.name || "System",
          estimatedTime: statusUpdate.estimatedTime || ""
        };
        
        // Add to status history
        return {
          ...order,
          statusHistory: [...(order.statusHistory || []), newUpdate]
        };
      })
    );
  };
  
  // Verify an order
  const verifyOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        return {
          ...order,
          status: "Verified" as OrderStatus,
        };
      })
    );
    
    // Add verification status update
    addStatusUpdate(orderId, {
      status: "Verified",
      remarks: "Order verified by " + currentUser?.name,
    });
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    
    // Mock users for testing
    const users = [
      {
        id: "user1",
        email: "admin@chhapai.com",
        password: "admin123",
        name: "Admin User",
        role: "Admin",
        department: "Admin",
      },
      {
        id: "user2",
        email: "sales@chhapai.com",
        password: "sales123",
        name: "Sales User",
        role: "Manager",
        department: "Sales",
      },
      {
        id: "user3",
        email: "design@chhapai.com",
        password: "design123",
        name: "Design User",
        role: "Worker",
        department: "Design",
      },
      {
        id: "user4",
        email: "prepress@chhapai.com",
        password: "prepress123",
        name: "Prepress User",
        role: "Worker",
        department: "Prepress",
      },
      {
        id: "user5",
        email: "production@chhapai.com",
        password: "production123",
        name: "Production User",
        role: "Worker",
        department: "Production",
      },
      // Add more users as needed
    ];

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      // Fix the type issue - create a valid User object
      const userObj: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        permissions: [], // Add the required permissions field
      };
      setCurrentUser(userObj);
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.setItem("isAuthenticated", "false");
  };
  
  // Check if a user's department can see a specific dashboard element
  const canUserSeeElement = (department: string, element: string): boolean => {
    // Simplified implementation since getDashboardConfig doesn't exist
    // Default permissions - can be expanded later
    const defaultPermissions = {
      "Admin": ["orders", "sales", "production", "design", "prepress", "finance"],
      "Sales": ["orders", "sales", "finance"],
      "Design": ["orders", "design"],
      "Production": ["orders", "production"],
      "Prepress": ["orders", "prepress"]
    };
    
    // @ts-ignore - Type safety for the mock implementation
    return defaultPermissions[department]?.includes(element) || false;
  };

  // Provide the context value
  const contextValue: OrderContextType = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addStatusUpdate,
    verifyOrder,
    isAuthenticated,
    currentUser,
    login,
    logout,
    canUserSeeElement,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the context
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
