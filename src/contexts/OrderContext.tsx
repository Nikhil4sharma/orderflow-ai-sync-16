
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Department, 
  DispatchDetails, 
  Notification, 
  Order, 
  OrderStatus, 
  PaymentRecord, 
  PaymentStatus,
  PermissionKey, 
  StatusUpdate, 
  User 
} from "@/types";
import { users } from "@/lib/mock-data";
import { generateId, shouldSendNotification } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import { toast } from "sonner";
import { generateNotification } from "@/lib/demo-data";

// Import demo data
import { getDemoOrders } from "@/lib/demo-data";

interface OrderContextType {
  orders: Order[];
  isAuthenticated: boolean;
  currentUser: User | null;
  notifications: Notification[];
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => void;
  updateStatusUpdate: (orderId: string, statusUpdateId: string, updates: Partial<StatusUpdate>) => void;
  getOrderById: (orderId: string) => Order | undefined;
  addPayment: (orderId: string, payment: Omit<PaymentRecord, "id">) => void;
  verifyOrder: (orderId: string) => void;
  hasPermission: (permission: PermissionKey) => boolean;
  markNotificationAsRead: (notificationId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // State for orders, authentication, and notifications
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with demo data on component mount
  useEffect(() => {
    // Load demo orders
    setOrders(getDemoOrders());
    
    // Auto-login with admin user for demo purposes
    const adminUser = users.find(u => u.role === "Admin");
    if (adminUser) {
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend
    // For demo purposes, we'll just check if the user exists in our mock data
    const user = users.find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Logout function
  const logoutUser = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Add a new order
  const addOrder = (order: Order) => {
    // Generate a unique ID if not provided
    const newOrder = {
      ...order,
      id: order.id || generateId(),
      createdAt: order.createdAt || new Date().toISOString(),
      statusHistory: order.statusHistory || [],
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  // Update an existing order
  const updateOrder = (order: Order) => {
    setOrders(prevOrders => {
      // Check if the order exists
      const existingOrder = prevOrders.find(o => o.id === order.id);
      
      if (!existingOrder) {
        return prevOrders;
      }
      
      // Check if status has changed, if so, we might need to send notifications
      if (existingOrder.status !== order.status || 
          existingOrder.currentDepartment !== order.currentDepartment ||
          existingOrder.designStatus !== order.designStatus ||
          existingOrder.prepressStatus !== order.prepressStatus) {
        
        // Get the current status for notification
        const currentStatus = order.designStatus || order.prepressStatus || order.status;
        
        // Check if we should send a notification
        if (shouldSendNotification(order.currentDepartment, currentStatus)) {
          generateNotification(order);
        }
      }
      
      return prevOrders.map(o => o.id === order.id ? order : o);
    });
  };

  // Delete an order
  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  // Add a status update to an order
  const addStatusUpdate = (orderId: string, statusUpdate: Partial<StatusUpdate>) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        const newStatusUpdate: StatusUpdate = {
          id: generateId(),
          orderId,
          timestamp: new Date().toISOString(),
          department: statusUpdate.department || (currentUser?.department as Department) || "Sales",
          status: statusUpdate.status || "In Progress",
          remarks: statusUpdate.remarks,
          updatedBy: statusUpdate.updatedBy || currentUser?.name || "Unknown",
          editableUntil: new Date(Date.now() + 15 * 60000).toISOString(), // Editable for 15 minutes
          estimatedTime: statusUpdate.estimatedTime,
          selectedProduct: statusUpdate.selectedProduct
        };
        
        return {
          ...order,
          statusHistory: [...(order.statusHistory || []), newStatusUpdate]
        };
      });
    });
  };

  // Update a status update in an order
  const updateStatusUpdate = (
    orderId: string, 
    statusUpdateId: string, 
    updates: Partial<StatusUpdate>
  ) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        const updatedStatusHistory = order.statusHistory.map(status => {
          if (status.id !== statusUpdateId) return status;
          
          return {
            ...status,
            ...updates,
            timestamp: status.timestamp // Keep the original timestamp
          };
        });
        
        return {
          ...order,
          statusHistory: updatedStatusHistory
        };
      });
    });
  };

  // Get an order by ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  // Add payment to an order
  const addPayment = (orderId: string, payment: Omit<PaymentRecord, "id">) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        const newPayment: PaymentRecord = {
          id: generateId(),
          ...payment
        };
        
        // Calculate new payment totals
        const newPaidAmount = order.paidAmount + payment.amount;
        const newPendingAmount = order.amount - newPaidAmount;
        
        // Determine payment status
        let paymentStatus: PaymentStatus = "Not Paid";
        if (newPaidAmount >= order.amount) {
          paymentStatus = "Paid";
        } else if (newPaidAmount > 0) {
          paymentStatus = "Partial";
        }
        
        return {
          ...order,
          paidAmount: newPaidAmount,
          pendingAmount: newPendingAmount,
          paymentStatus,
          paymentHistory: [...(order.paymentHistory || []), newPayment]
        };
      });
    });
  };

  // Verify an order (changes status to "Ready to Dispatch" so it can be dispatched)
  const verifyOrder = (orderId: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        // Add a verification status update
        const verificationUpdate: StatusUpdate = {
          id: generateId(),
          orderId,
          timestamp: new Date().toISOString(),
          department: "Sales",
          status: "Ready to Dispatch",
          updatedBy: currentUser?.name || "Unknown",
          remarks: "Order verified and ready for dispatch"
        };
        
        return {
          ...order,
          status: "Ready to Dispatch" as OrderStatus,
          statusHistory: [...(order.statusHistory || []), verificationUpdate]
        };
      });
    });
  };

  // Check if current user has a specific permission
  const checkPermission = (permission: PermissionKey): boolean => {
    return hasPermission(currentUser, permission);
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications => {
      return prevNotifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
    });
  };

  // Define the context value
  const contextValue: OrderContextType = {
    orders,
    isAuthenticated,
    currentUser,
    notifications,
    loginUser,
    logoutUser,
    addOrder,
    updateOrder,
    deleteOrder,
    addStatusUpdate,
    updateStatusUpdate,
    getOrderById,
    addPayment,
    verifyOrder,
    hasPermission: checkPermission,
    markNotificationAsRead
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
