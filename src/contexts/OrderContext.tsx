import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Order, 
  OrderStatus, 
  Department, 
  StatusUpdate, 
  OrderFilters 
} from '@/types';
import { toast } from 'sonner';

// Define the shape of the context
export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id'>) => Promise<string | undefined>;
  getOrder: (id: string) => Promise<Order | undefined>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    statusData: {
      department: Department;
      status: OrderStatus;
      remarks: string;
      estimatedTime?: string;
      selectedProduct?: string;
    }
  ) => Promise<void>;
  getFilteredOrders: (filters: OrderFilters) => Order[];
  getSortedOrders: (orders: Order[], sortBy: string, sortDirection: 'asc' | 'desc') => Order[];
  markReadyForDispatch: (orderId: string) => Promise<void>;
  canUserSeeElement: (elementId: string) => boolean;
}

// Create the context
const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: true,
  addOrder: async () => { return undefined },
  getOrder: async () => { return undefined },
  updateOrder: async () => {},
  deleteOrder: async () => {},
  updateOrderStatus: async () => {},
  getFilteredOrders: () => [],
  getSortedOrders: () => [],
  markReadyForDispatch: async () => {},
  canUserSeeElement: () => true,
});

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersCollection = collection(db, 'orders');
        const orderSnapshot = await getDocs(ordersCollection);
        const ordersList = orderSnapshot.docs.map(doc => {
          const data = doc.data();
          // Cast the data to ensure it conforms to the Order type
          return {
            ...data,
            id: doc.id,
            status: data.status as OrderStatus,
            currentDepartment: data.currentDepartment as Department,
            // Add missing properties if they don't exist in the data
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            paymentHistory: data.paymentHistory || []
          } as Order;
        });
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to add a new order
  const addOrder = async (order: Omit<Order, 'id'>): Promise<string | undefined> => {
    try {
      const ordersCollection = collection(db, 'orders');
      const docRef = await addDoc(ordersCollection, order);
      toast.success("Order created successfully!");
      return docRef.id; // Return the new order ID
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to create order");
      setError("Failed to create order");
      return undefined;
    }
  };

  // Function to get a single order by ID
  const getOrder = async (id: string): Promise<Order | undefined> => {
    try {
      const orderDoc = doc(db, 'orders', id);
      const docSnapshot = await getDoc(orderDoc);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          status: data.status as OrderStatus,
          currentDepartment: data.currentDepartment as Department,
        } as Order;
      } else {
        toast.error(`Order with ID ${id} not found`);
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order");
      return undefined;
    }
  };

  // Function to update an order
  const updateOrder = async (id: string, updates: Partial<Order>): Promise<void> => {
    try {
      const orderDoc = doc(db, 'orders', id);
      await updateDoc(orderDoc, updates);
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order => (order.id === id ? { ...order, ...updates } : order))
      );
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  // Function to delete an order
  const deleteOrder = async (id: string): Promise<void> => {
    try {
      const orderDoc = doc(db, 'orders', id);
      await deleteDoc(orderDoc);
      // Update local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId: string, statusData: {
    department: Department;
    status: OrderStatus;
    remarks: string;
    estimatedTime?: string;
    selectedProduct?: string;
  }) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);
  
      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }
  
      const orderData = orderSnapshot.data() as Order;
      const updates: Partial<Order> = {
        status: statusData.status,
        currentDepartment: statusData.department,
        lastUpdated: new Date().toISOString(),
      };
  
      // Update the order in Firestore
      await updateDoc(orderRef, updates);
  
      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );
  
      toast.success(`Order status updated to ${statusData.status}`);

      // Create a status update record
      const statusUpdate: StatusUpdate = {
        id: Date.now().toString(),
        orderId,
        timestamp: new Date().toISOString(),
        department: statusData.department,
        status: statusData.status,
        remarks: statusData.remarks,
        updatedBy: "Current User", // Replace with actual user
        editableUntil: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
        estimatedTime: statusData.estimatedTime,
        selectedProduct: statusData.selectedProduct
      };
  
      // Add the status update to the order's status history
      const updatedPaymentHistory = [...orderData.statusHistory || [], statusUpdate];
      await updateDoc(orderRef, { statusHistory: updatedPaymentHistory });
  
      // Optionally, update the local state with the new status history
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statusHistory: updatedPaymentHistory } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  // Function to filter orders based on criteria
  const getFilteredOrders = (filters: OrderFilters): Order[] => {
    if (!filters) return orders;
    
    return orders.filter(order => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(order.status)) {
        return false;
      }
  
      if (filters.department && filters.department.length > 0 && !filters.department.includes(order.currentDepartment)) {
        return false;
      }
  
      if (filters.paymentStatus && filters.paymentStatus.length > 0 && !filters.paymentStatus.includes(order.paymentStatus)) {
        return false;
      }
  
      if (filters.dateRange) {
        const orderDate = new Date(order.orderDate);
        const fromDate = filters.dateRange.from;
        const toDate = filters.dateRange.to;
  
        if (fromDate && orderDate < fromDate) {
          return false;
        }
  
        if (toDate && orderDate > toDate) {
          return false;
        }
      }
  
      if (filters.searchTerm && !order.orderName.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      return true; // Replace with actual filtering logic
    });
  };

  // Function to sort orders
  const getSortedOrders = (
    ordersToSort: Order[], 
    sortBy: string, 
    sortDirection: 'asc' | 'desc'
  ): Order[] => {
    const sortedOrders = [...ordersToSort]; // Create a copy to avoid mutating the original array
  
    sortedOrders.sort((a, b) => {
      const aValue = a[sortBy as keyof Order];
      const bValue = b[sortBy as keyof Order];
  
      if (aValue === undefined || bValue === undefined) {
        return 0; // Handle undefined values gracefully
      }
  
      let comparison = 0;
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        // If the types are not directly comparable, attempt to convert to string
        comparison = String(aValue).localeCompare(String(bValue));
      }
  
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
    return sortedOrders; // Replace with actual sorting logic
  };

  // Function to mark order as ready for dispatch
  const markReadyForDispatch = async (orderId: string): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Ready to Dispatch',
      });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'Ready to Dispatch' } : order
        )
      );
      toast.success('Order marked as Ready for Dispatch!');
    } catch (error) {
      console.error('Error marking order as ready for dispatch:', error);
      toast.error('Failed to mark order as Ready for Dispatch');
    }
  };

  // Function to check if user can see a dashboard element
  const canUserSeeElement = (elementId: string): boolean => {
    // Implement your logic here to determine if the user can see the element
    // based on the elementId and the user's role or permissions.
    return true; // Default implementation
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      addOrder,
      getOrder,
      updateOrder,
      deleteOrder,
      updateOrderStatus,
      getFilteredOrders,
      getSortedOrders,
      markReadyForDispatch,
      canUserSeeElement
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => useContext(OrderContext);
