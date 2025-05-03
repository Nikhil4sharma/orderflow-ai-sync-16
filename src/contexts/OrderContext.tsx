
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Order } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';

// Define the context type
interface OrderContextType {
  orders: Order[];
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Omit<any, 'id' | 'timestamp' | 'updatedBy'>) => void;
  deleteOrder: (orderId: string) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  filterOrdersByDepartment: (department: string) => Order[];
  filterOrdersByStatus: (status: string) => Order[];
}

// Create the context with a default value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Sample initial data
const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    clientName: 'Acme Corp',
    amount: 5000,
    paidAmount: 2500,
    pendingAmount: 2500,
    paymentStatus: 'Partially Paid',
    items: ['Business Cards', 'Letterheads'],
    createdAt: '2023-06-01T10:30:00Z',
    status: 'In Progress',
    currentDepartment: 'Design',
    statusHistory: [
      {
        id: 'status-1',
        orderId: '1',
        department: 'Sales',
        status: 'New',
        remarks: 'Order received',
        timestamp: '2023-06-01T10:30:00Z',
        updatedBy: 'Sales Team',
      },
      {
        id: 'status-2',
        orderId: '1',
        department: 'Design',
        status: 'In Progress',
        remarks: 'Design started',
        timestamp: '2023-06-02T09:15:00Z',
        updatedBy: 'Design Team',
      },
    ],
    productStatus: [
      {
        id: 'prod-1',
        name: 'Business Cards',
        status: 'processing',
      },
      {
        id: 'prod-2',
        name: 'Letterheads',
        status: 'processing',
      }
    ],
    paymentHistory: [
      {
        id: 'pay-1',
        amount: 2500,
        date: '2023-06-01T10:30:00Z',
        method: 'Bank Transfer',
      }
    ]
  }
];

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

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  }, []);

  const addStatusUpdate = useCallback((orderId: string, statusUpdate: Omit<any, 'id' | 'timestamp' | 'updatedBy'>) => {
    setOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          const now = new Date();
          const editableUntil = addHours(now, 1).toISOString();
          
          const newStatusUpdate = {
            id: uuidv4(),
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

  const value = {
    orders,
    users,
    currentUser,
    isAuthenticated,
    addOrder,
    updateOrder,
    addStatusUpdate,
    deleteOrder,
    loginUser,
    logoutUser,
    setCurrentUser,
    addUser,
    removeUser,
    filterOrdersByDepartment,
    filterOrdersByStatus,
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
