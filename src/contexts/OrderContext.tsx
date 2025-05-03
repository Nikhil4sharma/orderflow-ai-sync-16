
import React, { createContext, useContext, useState } from "react";
import { mockOrders, mockUsers } from "@/lib/mock-data";
import { Department, Order, StatusUpdate, User } from "@/types";

interface OrderContextType {
  orders: Order[];
  currentUser: User;
  loading: boolean;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Omit<StatusUpdate, 'id' | 'timestamp' | 'updatedBy'>) => void;
  filterOrdersByDepartment: (department: Department | 'All') => Order[];
  filterOrdersByStatus: (status: string | 'All') => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [loading, setLoading] = useState<boolean>(false);

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
    const newStatusUpdate: StatusUpdate = {
      ...statusUpdate,
      id: `upd${Date.now()}`,
      timestamp: new Date().toISOString(),
      updatedBy: currentUser.name,
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

  return (
    <OrderContext.Provider value={{ 
      orders, 
      currentUser, 
      loading, 
      setOrders, 
      setCurrentUser, 
      addOrder, 
      updateOrder, 
      addStatusUpdate,
      filterOrdersByDepartment,
      filterOrdersByStatus
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
