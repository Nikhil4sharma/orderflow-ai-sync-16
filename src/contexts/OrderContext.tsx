
import React, { createContext, useContext, useState, useEffect } from "react";
import { mockOrders, mockUsers } from "@/lib/mock-data";
import { Department, Order, StatusUpdate, User } from "@/types";
import { addHours } from "date-fns";

interface OrderContextType {
  orders: Order[];
  currentUser: User;
  users: User[];
  loading: boolean;
  isAuthenticated: boolean;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Omit<StatusUpdate, 'id' | 'timestamp' | 'updatedBy'>) => void;
  updateStatusUpdate: (orderId: string, updateId: string, statusUpdate: Partial<StatusUpdate>) => void;
  filterOrdersByDepartment: (department: Department | 'All') => Order[];
  filterOrdersByStatus: (status: string | 'All') => Order[];
  loginUser: (user: User) => void;
  logoutUser: () => void;
  addUser: (user: User) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initialize the mock orders with payment fields
const enhancedMockOrders = mockOrders.map(order => ({
  ...order,
  paidAmount: order.paidAmount || 0,
  pendingAmount: order.pendingAmount || order.amount,
  paymentStatus: order.paymentStatus || "Not Paid" as const,
  paymentHistory: order.paymentHistory || [],
  productStatus: order.productStatus || order.items.map((item, index) => ({
    id: `prod-${index}-${order.id}`,
    name: item,
    status: "processing" as const,
  }))
}));

// Enhanced mock users with email and password for login
const enhancedMockUsers = mockUsers.map(user => ({
  ...user,
  email: user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@orderflow.com`,
  password: user.password || "password123"
}));

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(enhancedMockOrders);
  const [users, setUsers] = useState<User[]>(enhancedMockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for stored authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(prev => 
      prev.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    );
  };

  const addStatusUpdate = (
    orderId: string, 
    statusUpdate: Omit<StatusUpdate, 'id' | 'timestamp' | 'updatedBy'>
  ) => {
    const now = new Date();
    // Set editable until to 1 hour from now by default
    const editableUntil = statusUpdate.editableUntil || addHours(now, 1).toISOString();

    const newStatusUpdate: StatusUpdate = {
      ...statusUpdate,
      id: `upd${Date.now()}`,
      timestamp: now.toISOString(),
      updatedBy: currentUser.name,
      editableUntil
    };

    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            statusHistory: [...order.statusHistory, newStatusUpdate],
            // Update current department and status based on the update
            currentDepartment: statusUpdate.department,
            status: statusUpdate.status as Order['status'],
          };
        }
        return order;
      })
    );
  };

  const updateStatusUpdate = (
    orderId: string, 
    updateId: string, 
    statusUpdate: Partial<StatusUpdate>
  ) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          const updatedStatusHistory = order.statusHistory.map(update => 
            update.id === updateId ? { ...update, ...statusUpdate } : update
          );
          return { ...order, statusHistory: updatedStatusHistory };
        }
        return order;
      })
    );
  };

  const filterOrdersByDepartment = (department: Department | 'All'): Order[] => {
    if (department === 'All') {
      return orders;
    }
    return orders.filter(order => order.currentDepartment === department);
  };

  const filterOrdersByStatus = (status: string | 'All'): Order[] => {
    if (status === 'All') {
      return orders;
    }
    return orders.filter(order => order.status === status);
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logoutUser = () => {
    setCurrentUser({} as User);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      currentUser,
      users, 
      loading,
      isAuthenticated,
      setOrders, 
      setCurrentUser, 
      addOrder, 
      updateOrder, 
      addStatusUpdate,
      updateStatusUpdate,
      filterOrdersByDepartment,
      filterOrdersByStatus,
      loginUser,
      logoutUser,
      addUser
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
