import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, User, OrderStatus, StatusUpdate, Department, Role, PaymentRecord, PermissionKey } from "@/types";
import { getDemoOrders } from "@/lib/demo-data";
import { DashboardConfiguration } from "@/types/dashboardConfig";
import { addHours, addMinutes } from "date-fns";
import { toast } from "sonner";

// Define the context type
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (updatedOrder: Order) => void;
  deleteOrder: (orderId: string) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => void;
  updateStatusUpdate: (update: StatusUpdate) => void;
  undoStatusUpdate: (updateId: string) => void;
  addPayment: (orderId: string, payment: Partial<PaymentRecord>) => void;
  verifyOrder: (orderId: string) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  canUserSeeElement: (department: string, element: string) => boolean;
  hasPermission: (permission: string) => boolean;
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  dashboardConfig: DashboardConfiguration;
  updateDashboardConfig: (config: DashboardConfiguration) => void;
}

// Create a context with an empty default value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : getDemoOrders();
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Mock users for the admin panel
  const [users, setUsers] = useState<User[]>([
    {
      id: "user1",
      email: "admin@chhapai.com",
      name: "Admin User",
      role: "Admin" as Role,
      department: "Admin" as Department,
      permissions: ["manage_users", "manage_departments", "update_order_status"] as PermissionKey[]
    },
    {
      id: "user2",
      email: "sales@chhapai.com",
      name: "Sales User",
      role: "Manager" as Role,
      department: "Sales" as Department,
      permissions: ["update_order_status", "verify_payment"] as PermissionKey[]
    },
    {
      id: "user3",
      email: "design@chhapai.com",
      name: "Design User",
      role: "Staff" as Role,
      department: "Design" as Department,
      permissions: ["update_order_status"] as PermissionKey[]
    }
  ]);

  // Default dashboard configuration
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>({
    departmentConfigs: {
      Sales: {
        department: 'Sales' as Department,
        visibleElements: [
          'financialSummary',
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'salesMetrics',
          'deliverySchedule'
        ]
      },
      Design: {
        department: 'Design' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList'
        ]
      },
      Prepress: {
        department: 'Prepress' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList'
        ]
      },
      Production: {
        department: 'Production' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'productionTimeline',
          'taskList'
        ]
      },
      Admin: {
        department: 'Admin' as Department,
        visibleElements: [
          'financialSummary',
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList',
          'salesMetrics',
          'productionTimeline',
          'deliverySchedule'
        ]
      }
    }
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
    const now = new Date();
    
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        // Create new status update with undo/edit time limits
        const newUpdate: StatusUpdate = {
          id: `status-${Date.now()}`,
          orderId: orderId,
          timestamp: now.toISOString(),
          department: statusUpdate.department || currentUser?.department || "Admin",
          status: statusUpdate.status || order.status,
          remarks: statusUpdate.remarks || "",
          updatedBy: currentUser?.name || "System",
          estimatedTime: statusUpdate.estimatedTime || "",
          selectedProduct: statusUpdate.selectedProduct,
          // Set editable time limit - 1 hour for regular users, unlimited for admins
          editableUntil: currentUser?.role === "Admin" ? 
            addHours(now, 24 * 365).toISOString() : // Admin - editable for a year (effectively forever)
            addHours(now, 1).toISOString(), // Regular users - 1 hour edit window
        };
        
        // Add to status history
        return {
          ...order,
          statusHistory: [...(order.statusHistory || []), newUpdate],
          lastUpdated: now.toISOString(),
        };
      })
    );
    
    toast.success("Status update added successfully");
  };

  // Update a status update
  const updateStatusUpdate = (update: StatusUpdate) => {
    const now = new Date();
    
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== update.orderId) return order;
        
        // Update the status history
        return {
          ...order,
          statusHistory: order.statusHistory.map(statusUpdate => 
            statusUpdate.id === update.id ? 
            {
              ...update,
              updatedAt: now.toISOString(), // Track when the update was edited
            } : 
            statusUpdate
          ),
          lastUpdated: now.toISOString(),
        };
      })
    );
    
    toast.success("Status update modified successfully");
  };
  
  // Undo (delete) a status update
  const undoStatusUpdate = (updateId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        // Find if this order contains the update
        const hasUpdate = order.statusHistory.some(update => update.id === updateId);
        
        if (!hasUpdate) return order;
        
        // Remove the specified update from history
        const updatedHistory = order.statusHistory.filter(update => update.id !== updateId);
        
        // If this was the only update, we need to keep at least the initial state
        if (updatedHistory.length === 0) {
          return order;
        }
        
        // Get the most recent status after removing the undone update
        const latestUpdate = updatedHistory[updatedHistory.length - 1];
        
        // Update order status based on latest remaining update
        return {
          ...order,
          status: latestUpdate.status as OrderStatus,
          statusHistory: updatedHistory,
          lastUpdated: new Date().toISOString(),
        };
      })
    );
    
    toast.success("Status update has been undone");
  };

  // Add payment record to an order
  const addPayment = (orderId: string, payment: Partial<PaymentRecord>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        // Create new payment record
        const newPayment: PaymentRecord = {
          id: `payment-${Date.now()}`,
          amount: payment.amount || 0,
          date: payment.date || new Date().toISOString(),
          method: payment.method || "Not specified",
          remarks: payment.remarks || ""
        };
        
        // Calculate new paid and pending amounts
        const newPaidAmount = order.paidAmount + (payment.amount || 0);
        const newPendingAmount = Math.max(0, order.amount - newPaidAmount);
        
        // Determine new payment status
        let newPaymentStatus = order.paymentStatus;
        if (newPendingAmount <= 0) {
          newPaymentStatus = "Paid";
        } else if (newPaidAmount > 0) {
          newPaymentStatus = "Partial";
        }
        
        // Add payment to history
        return {
          ...order,
          paidAmount: newPaidAmount,
          pendingAmount: newPendingAmount,
          paymentStatus: newPaymentStatus,
          paymentHistory: [...(order.paymentHistory || []), newPayment],
          lastPaymentDate: new Date().toISOString()
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
    console.log("Login attempt:", { email, password });
    
    // Mock users for testing
    const loginUsers = [
      {
        id: "user1",
        email: "admin@chhapai.com",
        password: "admin123",
        name: "Admin User",
        role: "Admin" as Role,
        department: "Admin" as Department,
        permissions: ["manage_users", "manage_departments", "update_order_status"] as PermissionKey[],
      },
      {
        id: "user2",
        email: "sales@chhapai.com",
        password: "sales123",
        name: "Sales User",
        role: "Manager" as Role,
        department: "Sales" as Department,
        permissions: ["update_order_status", "verify_payment"] as PermissionKey[],
      },
      {
        id: "user3",
        email: "design@chhapai.com",
        password: "design123",
        name: "Design User",
        role: "Staff" as Role,
        department: "Design" as Department,
        permissions: ["update_order_status"] as PermissionKey[],
      },
      {
        id: "user4",
        email: "prepress@chhapai.com",
        password: "prepress123",
        name: "Prepress User",
        role: "Staff" as Role,
        department: "Prepress" as Department,
        permissions: ["update_order_status"] as PermissionKey[],
      },
      {
        id: "user5",
        email: "production@chhapai.com",
        password: "production123",
        name: "Production User",
        role: "Staff" as Role,
        department: "Production" as Department,
        permissions: ["update_order_status"] as PermissionKey[],
      },
    ];

    // Normalize email for case-insensitive comparison
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user with matching email and password
    const user = loginUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    console.log("Found user:", user);

    if (user) {
      setIsAuthenticated(true);
      // Create a valid User object
      const userObj: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        permissions: user.permissions,
      };
      setCurrentUser(userObj);
      return true;
    }

    return false;
  };

  // Alternative login function for LoginForm component
  const loginUser = async (email: string, password: string): Promise<void> => {
    const success = await login(email, password);
    if (!success) {
      throw new Error("Invalid credentials");
    }
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
    // Simplified implementation
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

  // Check if current user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === "Admin") return true;
    
    // Check if the user has the specific permission
    return currentUser.permissions?.includes(permission as any) || false;
  };

  // Add a user
  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  // Remove a user
  const removeUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  // Update dashboard config
  const updateDashboardConfig = (config: DashboardConfiguration) => {
    setDashboardConfig(config);
  };

  // Provide the context value
  const contextValue: OrderContextType = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addStatusUpdate,
    updateStatusUpdate,
    undoStatusUpdate,
    addPayment,
    verifyOrder,
    isAuthenticated,
    currentUser,
    login,
    loginUser,
    logout,
    setCurrentUser,
    canUserSeeElement,
    hasPermission,
    users,
    addUser,
    removeUser,
    dashboardConfig,
    updateDashboardConfig
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
