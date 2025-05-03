import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Order, StatusUpdate, Department, FilterOptions, GoogleSheetConfig } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { demoOrders } from '@/lib/demo-orders';
import { filterOrdersByMultipleCriteria } from '@/lib/utils';
import { syncOrdersWithGoogleSheet, importOrdersFromSheet } from '@/utils/googleSheetUtils';
import { toast } from 'sonner';

// Define the context type
interface OrderContextType {
  orders: Order[];
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Omit<any, 'id' | 'timestamp' | 'updatedBy'>) => void;
  updateStatusUpdate: (orderId: string, updateId: string, updates: Partial<StatusUpdate>) => void;
  deleteOrder: (orderId: string) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  filterOrdersByDepartment: (department: string) => Order[];
  filterOrdersByStatus: (status: string) => Order[];
  filterOrdersByMultipleCriteria: (filters: FilterOptions) => Order[];
  getUsersByDepartment: (department: Department) => User[];
  getOrdersForCurrentUser: () => Order[];
  syncWithGoogleSheet: (config: GoogleSheetConfig) => Promise<boolean>;
  importFromGoogleSheet: (config: GoogleSheetConfig) => Promise<boolean>;
  googleSheetConfig: GoogleSheetConfig | null;
  setGoogleSheetConfig: (config: GoogleSheetConfig) => void;
}

// Create the context with a default value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Sample initial data
const initialOrders: Order[] = demoOrders;

const initialUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@orderflow.com',
    password: 'admin123',
    department: 'Sales',
    role: 'Admin',
  },
  {
    id: 'sales1',
    name: 'Sales User',
    email: 'sales@orderflow.com',
    password: 'sales123',
    department: 'Sales',
    role: 'Member',
  },
  {
    id: 'design1',
    name: 'Design User',
    email: 'design@orderflow.com',
    password: 'design123',
    department: 'Design',
    role: 'Member',
  },
  {
    id: 'prod1',
    name: 'Production User',
    email: 'production@orderflow.com',
    password: 'production123',
    department: 'Production',
    role: 'Member',
  },
  {
    id: 'prepress1',
    name: 'Prepress User',
    email: 'prepress@orderflow.com',
    password: 'prepress123',
    department: 'Prepress',
    role: 'Member',
  },
];

interface OrderProviderProps {
  children: ReactNode;
}

// Provider component
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleSheetConfig, setGoogleSheetConfig] = useState<GoogleSheetConfig | null>(null);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  }, []);

  const addStatusUpdate = useCallback((orderId: string, statusUpdate: Omit<StatusUpdate, 'id' | 'timestamp' | 'updatedBy'>) => {
    setOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          const now = new Date();
          const editableUntil = addHours(now, 1).toISOString();
          
          const newStatusUpdate: StatusUpdate = {
            id: uuidv4(),
            orderId: orderId,
            timestamp: new Date().toISOString(),
            updatedBy: currentUser?.name || 'Unknown User',
            editableUntil,
            ...statusUpdate,
          };
          
          return {
            ...order,
            statusHistory: [...order.statusHistory, newStatusUpdate]
          };
        }
        return order;
      });
    });
  }, [currentUser]);

  const updateStatusUpdate = useCallback((orderId: string, updateId: string, updates: Partial<StatusUpdate>) => {
    setOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          const updatedHistory = order.statusHistory.map(update => 
            update.id === updateId ? { ...update, ...updates } : update
          );
          
          return {
            ...order,
            statusHistory: updatedHistory
          };
        }
        return order;
      });
    });
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  }, []);

  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  const filterOrdersByDepartment = useCallback((department: string) => {
    if (department === 'All') return orders;
    return orders.filter(order => order.currentDepartment === department);
  }, [orders]);

  const filterOrdersByStatus = useCallback((status: string) => {
    if (status === 'All') return orders;
    return orders.filter(order => order.status === status);
  }, [orders]);

  const filteredOrdersByMultipleCriteria = useCallback((filters: FilterOptions) => {
    return filterOrdersByMultipleCriteria(orders, filters);
  }, [orders]);

  const getUsersByDepartment = useCallback((department: Department) => {
    if (department === 'All') return users;
    return users.filter(user => user.department === department);
  }, [users]);

  const getOrdersForCurrentUser = useCallback(() => {
    if (!currentUser) return [];
    
    // Admin can see all orders
    if (currentUser.role === 'Admin') return orders;
    
    // Sales can see all orders
    if (currentUser.department === 'Sales') return orders;
    
    // Other departments only see orders assigned to them
    return orders.filter(order => order.currentDepartment === currentUser.department);
  }, [orders, currentUser]);

  const syncWithGoogleSheet = useCallback(async (config: GoogleSheetConfig) => {
    try {
      const result = await syncOrdersWithGoogleSheet(orders, config);
      
      if (result.success) {
        setGoogleSheetConfig(config);
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error) {
      console.error("Error syncing with Google Sheet:", error);
      toast.error(`Error syncing with Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [orders]);

  const importFromGoogleSheet = useCallback(async (config: GoogleSheetConfig) => {
    try {
      const result = await importOrdersFromSheet(config);
      
      if (result.success && result.orders) {
        // Add each imported order
        result.orders.forEach(orderData => {
          // Skip if order with this sheet ID already exists
          if (orderData.sheetSyncId && orders.some(o => o.sheetSyncId === orderData.sheetSyncId)) {
            return;
          }
          
          // Create order with required fields
          const order = {
            id: `import-${uuidv4()}`,
            orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
            clientName: orderData.clientName || "Imported Client",
            amount: orderData.amount || 0,
            paidAmount: orderData.paidAmount || 0,
            pendingAmount: orderData.pendingAmount || 0,
            items: orderData.items || [],
            createdAt: orderData.createdAt || new Date().toISOString(),
            status: orderData.status || 'New',
            currentDepartment: orderData.currentDepartment || 'Sales',
            paymentStatus: orderData.paymentStatus || 'Not Paid',
            statusHistory: [{
              id: uuidv4(),
              orderId: uuidv4(),
              department: 'Sales',
              status: 'Imported from Google Sheet',
              timestamp: new Date().toISOString(),
              updatedBy: currentUser?.name || 'System'
            }],
            sheetSyncId: orderData.sheetSyncId
          } as Order;
          
          addOrder(order);
        });
        
        setGoogleSheetConfig(config);
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error) {
      console.error("Error importing from Google Sheet:", error);
      toast.error(`Error importing from Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [orders, currentUser, addOrder]);

  const value = {
    orders,
    users,
    currentUser,
    isAuthenticated,
    addOrder,
    updateOrder,
    addStatusUpdate,
    updateStatusUpdate,
    deleteOrder,
    loginUser,
    logoutUser,
    setCurrentUser,
    addUser,
    removeUser,
    filterOrdersByDepartment,
    filterOrdersByStatus,
    filterOrdersByMultipleCriteria: filteredOrdersByMultipleCriteria,
    getUsersByDepartment,
    getOrdersForCurrentUser,
    syncWithGoogleSheet,
    importFromGoogleSheet,
    googleSheetConfig,
    setGoogleSheetConfig,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// Create a hook for using the OrderContext
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Export the useOrdersExtended function to provide the additional functionality
export const useOrdersExtended = () => {
  const originalContext = useOrders();
  
  const removeUser = (userId: string) => {
    // Since we can't modify the original context directly in the read-only file,
    // we now have a proper removeUser function in our context implementation
    originalContext.removeUser(userId);
  };
  
  return {
    ...originalContext,
    removeUser
  };
};
