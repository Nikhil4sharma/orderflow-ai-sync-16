
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Order, StatusUpdate, Department, FilterOptions, GoogleSheetConfig, PermissionKey, UserRole } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { demoOrders } from '@/lib/demo-orders';
import { filterOrdersByMultipleCriteria } from '@/lib/utils';
import { hasPermission, filterOrderDataForUser } from '@/lib/permissions';

// Define the context interface
interface OrderContextType {
  orders: Order[];
  filteredOrders: Order[];
  filterOptions: FilterOptions;
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  setFilterOptions: (options: FilterOptions) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  addStatusUpdate: (orderId: string, update: Partial<StatusUpdate>) => void;
  updateStatusUpdate: (orderId: string, updateId: string, update: Partial<StatusUpdate>) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  canEditStatusUpdate: (update: StatusUpdate) => boolean;
  exportOrders: () => void;
  importOrders: (orders: Order[]) => void;
  hasPermission: (permission: PermissionKey) => boolean;
  verifyOrder: (orderId: string) => void;
  setCurrentUser: (user: User) => void;
  filterOrdersByDepartment: (department: Department | 'All') => Order[];
  filterOrdersByStatus: (status: string | 'All') => Order[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

// Create the context with a default empty object (with "as any" to avoid TypeScript errors)
const OrderContext = createContext<OrderContextType>({} as OrderContextType);

// Provider component
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : demoOrders;
  });
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    department: 'All',
    status: 'All',
    searchQuery: '',
    dateRange: null,
  });

  // Mock users for demo
  const [users, setUsers] = useState<User[]>(() => {
    return [
      { id: 'admin1', name: 'Admin User', department: 'Sales', role: 'Admin', email: 'admin@orderflow.com' },
      { id: 'sales1', name: 'Sales User', department: 'Sales', role: 'Sales', email: 'sales@orderflow.com' },
      { id: 'design1', name: 'Design User', department: 'Design', role: 'Design', email: 'design@orderflow.com' },
      { id: 'prod1', name: 'Production User', department: 'Production', role: 'Production', email: 'production@orderflow.com' }
    ];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const isAuthenticated = Boolean(currentUser);
  
  // Apply filters to get filtered orders
  const filteredOrders = filterOrdersByMultipleCriteria(orders, filterOptions);
  
  // Department and Status filtering functions for Dashboard
  const filterOrdersByDepartment = useCallback((department: Department | 'All') => {
    if (department === 'All') return orders;
    return orders.filter(order => order.currentDepartment === department);
  }, [orders]);
  
  const filterOrdersByStatus = useCallback((status: string | 'All') => {
    if (status === 'All') return orders;
    return orders.filter(order => order.status === status);
  }, [orders]);

  // Add a new order
  const addOrder = useCallback((order: Order) => {
    const newOrder: Order = {
      ...order,
      id: order.id || uuidv4(),
      createdAt: order.createdAt || new Date().toISOString(),
      statusHistory: order.statusHistory || [],
    };
    
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);
  
  // Add a user
  const addUser = useCallback((user: User) => {
    setUsers(prevUsers => {
      const newUser = {
        ...user,
        id: user.id || uuidv4()
      };
      return [...prevUsers, newUser];
    });
  }, []);
  
  // Remove a user
  const removeUser = useCallback((userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  }, []);
  
  // Update an existing order
  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      );
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);
  
  // Delete an order
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);
  
  // Get an order by ID
  const getOrderById = useCallback((orderId: string) => {
    const order = orders.find(order => order.id === orderId);
    if (!order) return undefined;
    
    // If the user doesn't have permission to view financial data, filter it out
    if (currentUser && !hasPermission(currentUser, "view_financial_data")) {
      return filterOrderDataForUser(order, currentUser) as Order;
    }
    
    return order;
  }, [orders, currentUser]);
  
  // Add a status update to an order
  const addStatusUpdate = useCallback((orderId: string, update: Partial<StatusUpdate>) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const timestamp = new Date().toISOString();
          const newUpdate: StatusUpdate = {
            id: uuidv4(),
            orderId: orderId,
            timestamp,
            department: update.department || order.currentDepartment,
            status: update.status || order.status,
            remarks: update.remarks || '',
            updatedBy: currentUser?.name || 'System',
            estimatedTime: update.estimatedTime,
            editableUntil: addHours(new Date(), 24).toISOString(),
            selectedProduct: update.selectedProduct
          };
          
          return {
            ...order,
            statusHistory: [...(order.statusHistory || []), newUpdate]
          };
        }
        return order;
      });
      
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, [currentUser]);
  
  // Update a status update in an order
  const updateStatusUpdate = useCallback((orderId: string, updateId: string, updatedFields: Partial<StatusUpdate>) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedStatusHistory = order.statusHistory.map(update => 
            update.id === updateId 
              ? { ...update, ...updatedFields, editedAt: new Date().toISOString() } 
              : update
          );
          
          return {
            ...order,
            statusHistory: updatedStatusHistory
          };
        }
        return order;
      });
      
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);
  
  // Login user
  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('username', user.name); // For legacy compatibility
  }, []);
  
  // Logout user
  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
  }, []);
  
  // Check if a status update can be edited (within 24 hours)
  const canEditStatusUpdate = useCallback((update: StatusUpdate) => {
    if (!update.editableUntil) return false;
    
    const now = new Date();
    const editableUntil = new Date(update.editableUntil);
    
    return now < editableUntil;
  }, []);
  
  // Export orders to JSON
  const exportOrders = useCallback(() => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `orders_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [orders]);
  
  // Import orders from JSON
  const importOrders = useCallback((importedOrders: Order[]) => {
    setOrders(prevOrders => {
      const updatedOrders = [...importedOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);
  
  // Check if current user has a specific permission
  const checkPermission = useCallback((permission: PermissionKey): boolean => {
    return hasPermission(currentUser, permission);
  }, [currentUser]);
  
  // Verify an order (move from Completed to Verified status)
  const verifyOrder = useCallback((orderId: string) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === orderId && order.status === "Completed") {
          const verifiedOrder = {
            ...order,
            status: "Verified" as const
          };
          
          return verifiedOrder;
        }
        return order;
      });
      
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
    
    // Add status update
    addStatusUpdate(orderId, {
      status: "Verified",
      department: "Sales",
      remarks: "Order verified and ready for dispatch",
    });
    
  }, [addStatusUpdate]);
  
  const contextValue: OrderContextType = {
    orders,
    filteredOrders,
    filterOptions,
    currentUser,
    isAuthenticated,
    users,
    setFilterOptions,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    addStatusUpdate,
    updateStatusUpdate,
    loginUser,
    logoutUser,
    canEditStatusUpdate,
    exportOrders,
    importOrders,
    hasPermission: checkPermission,
    verifyOrder,
    setCurrentUser,
    filterOrdersByDepartment,
    filterOrdersByStatus,
    addUser,
    removeUser,
  };
  
  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  
  return context;
};
