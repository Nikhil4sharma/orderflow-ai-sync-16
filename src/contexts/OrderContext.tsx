
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Order,
  User,
  StatusUpdate,
  PaymentRecord,
  OrderStatus,
  Department
} from "@/types";
import { getMockOrders, getMockUsers } from "@/lib/mock-data";
import { toast } from "sonner";
import { DashboardConfiguration, DEFAULT_DASHBOARD_CONFIG } from "@/types/dashboardConfig";

// Define our context type
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  currentUser: User | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => void;
  recordPayment: (orderId: string, payment: PaymentRecord) => void;
  verifyOrder: (orderId: string) => void;
  // New dashboard configuration properties
  dashboardConfig: DashboardConfiguration;
  updateDashboardConfig: (config: DashboardConfiguration) => void;
  canUserSeeElement: (department: Department, element: string) => boolean;
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : getMockOrders();
  });

  // State for users
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : getMockUsers();
  });

  // State for authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // State for dashboard configuration
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>(() => {
    const savedConfig = localStorage.getItem("dashboardConfig");
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_DASHBOARD_CONFIG;
  });

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [currentUser, isAuthenticated]);

  // Save dashboard configuration to localStorage
  useEffect(() => {
    localStorage.setItem("dashboardConfig", JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  // Order functions
  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  const updateOrder = (order: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === order.id ? order : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((o) => o.id !== id));
  };

  // User functions
  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const updateUser = (user: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? user : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
  };

  // Authentication functions
  const loginUser = (email: string, password: string) => {
    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Add status update to order
  const addStatusUpdate = (orderId: string, statusUpdate: Partial<StatusUpdate>) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newStatusUpdate: StatusUpdate = {
      id: `status-${Date.now()}`,
      orderId,
      timestamp: new Date().toISOString(),
      department: statusUpdate.department || currentUser?.department || "Sales",
      status: statusUpdate.status || order.status,
      remarks: statusUpdate.remarks || "",
      updatedBy: currentUser?.name || "Anonymous",
      estimatedTime: statusUpdate.estimatedTime,
    };

    const updatedOrder = {
      ...order,
      statusHistory: [...(order.statusHistory || []), newStatusUpdate],
    };

    updateOrder(updatedOrder);
  };

  // Record payment for an order
  const recordPayment = (orderId: string, payment: PaymentRecord) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Calculate new payment status
    const newPaidAmount = order.paidAmount + payment.amount;
    const newPendingAmount = order.amount - newPaidAmount;
    let newPaymentStatus: "Paid" | "Partial" | "Not Paid" = "Not Paid";

    if (newPaidAmount >= order.amount) {
      newPaymentStatus = "Paid";
    } else if (newPaidAmount > 0) {
      newPaymentStatus = "Partial";
    }

    const updatedOrder = {
      ...order,
      paidAmount: newPaidAmount,
      pendingAmount: newPendingAmount,
      paymentStatus: newPaymentStatus,
      paymentHistory: [
        ...(order.paymentHistory || []),
        {
          ...payment,
          id: `payment-${Date.now()}`,
          date: payment.date || new Date().toISOString(),
        },
      ],
    };

    updateOrder(updatedOrder);

    // Add status update for payment
    addStatusUpdate(orderId, {
      department: "Sales",
      status: `Payment ${newPaymentStatus}`,
      remarks: `Received payment of ₹${payment.amount} via ${payment.method}. ${payment.remarks || ''}`,
    });
  };

  // Verify order (for production to dispatch)
  const verifyOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: "Verified" as OrderStatus,
    };

    updateOrder(updatedOrder);

    // Add status update for verification
    addStatusUpdate(orderId, {
      department: "Sales",
      status: "Verified",
      remarks: "Order verified and ready to dispatch",
    });
  };

  // Dashboard configuration functions
  const updateDashboardConfig = (config: DashboardConfiguration) => {
    // Update the timestamp and user who made the change
    const updatedConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser?.name || 'Unknown'
    };
    
    setDashboardConfig(updatedConfig);
    toast.success("Dashboard configuration updated successfully");
  };

  // Check if a user's department can see a specific dashboard element
  const canUserSeeElement = (department: Department, element: string) => {
    if (!dashboardConfig.departmentConfigs[department]) {
      return false;
    }
    
    return dashboardConfig.departmentConfigs[department].visibleElements.includes(element as any);
  };

  const value = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    users,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
    isAuthenticated,
    loginUser,
    logoutUser,
    addStatusUpdate,
    recordPayment,
    verifyOrder,
    dashboardConfig,
    updateDashboardConfig,
    canUserSeeElement,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Custom hook to use the orders context
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
