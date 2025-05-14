
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Order, 
  OrderStatus, 
  Department, 
  StatusUpdate, 
  PaymentRecord,
  PaymentStatus,
  PermissionKey
} from '@/types';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/UserContext';

// Import OrderFilters from types/order.ts
import { OrderFilters } from '@/types/order';

// Define the shape of the context
export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  currentUser: any; // Add currentUser property
  addOrder: (order: Omit<Order, 'id'>) => Promise<string | undefined>;
  getOrder: (id: string) => Promise<Order | undefined>;
  updateOrder: (order: Order) => Promise<void>;
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
  // Add missing methods and properties
  addStatusUpdate: (orderId: string, statusData: {
    department: Department;
    status: OrderStatus;
    remarks: string;
    estimatedTime?: string;
    selectedProduct?: string;
    orderId?: string;
  }) => Promise<void>;
  updateStatusUpdate: (orderId: string, updateId: string, updates: Partial<StatusUpdate>) => Promise<void>;
  undoStatusUpdate: (orderId: string, updateId: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  addPayment: (orderId: string, payment: Omit<PaymentRecord, 'id'>) => Promise<void>;
}

// Create the context
const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: true,
  currentUser: null, // Default value for currentUser
  addOrder: async () => { return undefined },
  getOrder: async () => { return undefined },
  updateOrder: async () => {},
  deleteOrder: async () => {},
  updateOrderStatus: async () => {},
  getFilteredOrders: () => [],
  getSortedOrders: () => [],
  markReadyForDispatch: async () => {},
  canUserSeeElement: () => true,
  // Add default implementations for new methods
  addStatusUpdate: async () => {},
  updateStatusUpdate: async () => {},
  undoStatusUpdate: async () => {},
  hasPermission: () => false,
  addPayment: async () => {},
});

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUsers(); // Get currentUser from UserContext

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
            paymentStatus: data.paymentStatus as PaymentStatus,
            // Add missing properties if they don't exist in the data
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            paymentHistory: data.paymentHistory || [],
            statusHistory: data.statusHistory || []
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
          paymentStatus: data.paymentStatus as PaymentStatus,
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
  const updateOrder = async (updatedOrder: Order): Promise<void> => {
    try {
      const { id, ...orderData } = updatedOrder;
      const orderDoc = doc(db, 'orders', id);
      await updateDoc(orderDoc, orderData);
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order => (order.id === id ? updatedOrder : order))
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
        updatedBy: currentUser?.name || "Unknown User",
        editableUntil: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
        estimatedTime: statusData.estimatedTime,
        selectedProduct: statusData.selectedProduct
      };
  
      // Add the status update to the order's status history
      const updatedStatusHistory = [...(orderData.statusHistory || []), statusUpdate];
      await updateDoc(orderRef, { statusHistory: updatedStatusHistory });
  
      // Update the local state with the new status history
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statusHistory: updatedStatusHistory } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  // New function to add a status update
  const addStatusUpdate = async (orderId: string, statusData: {
    department: Department;
    status: OrderStatus;
    remarks: string;
    estimatedTime?: string;
    selectedProduct?: string;
    orderId?: string;
  }) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnapshot.data() as Order;

      // Create a status update record
      const statusUpdate: StatusUpdate = {
        id: Date.now().toString(),
        orderId,
        timestamp: new Date().toISOString(),
        department: statusData.department,
        status: statusData.status,
        remarks: statusData.remarks,
        updatedBy: currentUser?.name || "Unknown User",
        editableUntil: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
        estimatedTime: statusData.estimatedTime,
        selectedProduct: statusData.selectedProduct
      };

      // Add the status update to the order's status history
      const updatedStatusHistory = [...(orderData.statusHistory || []), statusUpdate];
      await updateDoc(orderRef, { statusHistory: updatedStatusHistory });

      // Update the local state with the new status history
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statusHistory: updatedStatusHistory } : order
        )
      );

      toast.success("Status update added successfully");
    } catch (error) {
      console.error("Error adding status update:", error);
      toast.error("Failed to add status update");
    }
  };

  // Function to update a status update
  const updateStatusUpdate = async (orderId: string, updateId: string, updates: Partial<StatusUpdate>) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnapshot.data() as Order;
      const statusHistory = orderData.statusHistory || [];
      
      // Find and update the status update
      const updatedStatusHistory = statusHistory.map(update => 
        update.id === updateId ? { ...update, ...updates } : update
      );

      // Update the order in Firestore
      await updateDoc(orderRef, { statusHistory: updatedStatusHistory });

      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statusHistory: updatedStatusHistory } : order
        )
      );

      toast.success("Status update modified successfully");
    } catch (error) {
      console.error("Error updating status update:", error);
      toast.error("Failed to update status");
    }
  };

  // Function to undo a status update
  const undoStatusUpdate = async (orderId: string, updateId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnapshot.data() as Order;
      const statusHistory = orderData.statusHistory || [];
      
      // Remove the status update
      const updatedStatusHistory = statusHistory.filter(update => update.id !== updateId);

      // Update the order in Firestore
      await updateDoc(orderRef, { statusHistory: updatedStatusHistory });

      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, statusHistory: updatedStatusHistory } : order
        )
      );

      toast.success("Status update removed successfully");
    } catch (error) {
      console.error("Error removing status update:", error);
      toast.error("Failed to remove status update");
    }
  };

  // Function to add a payment record
  const addPayment = async (orderId: string, payment: Omit<PaymentRecord, 'id'>) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (!orderSnapshot.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnapshot.data() as Order;
      
      // Create a payment record
      const paymentRecord: PaymentRecord = {
        id: Date.now().toString(),
        ...payment
      };

      // Add the payment to the order's payment history
      const updatedPaymentHistory = [...(orderData.paymentHistory || []), paymentRecord];
      
      // Calculate new payment totals
      const totalPaid = updatedPaymentHistory.reduce((sum, p) => sum + p.amount, 0);
      const paymentStatus = totalPaid >= orderData.amount 
        ? 'Paid' as PaymentStatus 
        : totalPaid > 0 
        ? 'Partial' as PaymentStatus 
        : 'Pending' as PaymentStatus;

      const updates = {
        paymentHistory: updatedPaymentHistory,
        paidAmount: totalPaid,
        pendingAmount: orderData.amount - totalPaid,
        paymentStatus
      };

      // Update the order in Firestore
      await updateDoc(orderRef, updates);

      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );

      toast.success("Payment added successfully");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
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
        const orderDate = order.createdAt ? new Date(order.createdAt) : null;
        const fromDate = filters.dateRange.from;
        const toDate = filters.dateRange.to;
  
        if (fromDate && orderDate && orderDate < fromDate) {
          return false;
        }
  
        if (toDate && orderDate && orderDate > toDate) {
          return false;
        }
      }
  
      if (filters.searchTerm && !(
        order.clientName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )) {
        return false;
      }
      return true;
    });
  };

  // Function to sort orders
  const getSortedOrders = (
    ordersToSort: Order[], 
    sortBy: string, 
    sortDirection: 'asc' | 'desc'
  ): Order[] => {
    const sortedOrders = [...ordersToSort];
  
    sortedOrders.sort((a, b) => {
      const aValue = a[sortBy as keyof Order];
      const bValue = b[sortBy as keyof Order];
  
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
  
      let comparison = 0;
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
  
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
    return sortedOrders;
  };

  // Function to mark order as ready for dispatch
  const markReadyForDispatch = async (orderId: string): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Ready to Dispatch' as OrderStatus,
      });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'Ready to Dispatch' as OrderStatus } : order
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
    // Implement logic to determine if the user can see the element
    return true; // Default implementation
  };

  // Function to check if user has a specific permission
  const hasPermission = (permission: PermissionKey): boolean => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      currentUser, // Pass the currentUser
      addOrder,
      getOrder,
      updateOrder,
      deleteOrder,
      updateOrderStatus,
      getFilteredOrders,
      getSortedOrders,
      markReadyForDispatch,
      canUserSeeElement,
      addStatusUpdate,
      updateStatusUpdate,
      undoStatusUpdate,
      hasPermission,
      addPayment
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => useContext(OrderContext);
