
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, StatusUpdate, Department, OrderStatus, OrderFilters, PaymentRecord, User } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { useUsers as useUsersImport } from './UserContext';

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => Promise<void>;
  markReadyForDispatch: (orderId: string) => Promise<void>;
  deleteAllOrders: () => Promise<void>;
  addMultipleOrders: (orders: Order[]) => Promise<void>;
  currentUser: User | null;
  getFilteredOrders: (filters: OrderFilters) => Order[];
  getSortedOrders: (orders: Order[], sortBy: string, sortDirection: 'asc' | 'desc') => Order[];
  hasPermission: (permission: string) => boolean;
  verifyOrder: (orderId: string, verificationData: any) => Promise<void>;
  addPayment: (orderId: string, payment: PaymentRecord) => Promise<void>;
  updateStatusUpdate: (orderId: string, updateId: string, newData: Partial<StatusUpdate>) => Promise<void>;
  undoStatusUpdate: (orderId: string, updateId: string) => Promise<void>;
  canUserSeeElement: (elementId: string) => boolean;
  getOrder: (orderId: string) => Order | null;
  logout: () => void;
};

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: false,
  error: null,
  addOrder: async () => {},
  updateOrder: async () => {},
  deleteOrder: async () => {},
  addStatusUpdate: async () => {},
  markReadyForDispatch: async () => {},
  deleteAllOrders: async () => {},
  addMultipleOrders: async () => {},
  currentUser: null,
  getFilteredOrders: () => [],
  getSortedOrders: () => [],
  hasPermission: () => false,
  verifyOrder: async () => {},
  addPayment: async () => {},
  updateStatusUpdate: async () => {},
  undoStatusUpdate: async () => {},
  canUserSeeElement: () => true,
  getOrder: () => null,
  logout: () => {},
});

export const useOrders = () => useContext(OrderContext);
export const useUsers = useUsersImport; // Re-export useUsers

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, hasPermission, logout } = useUsersImport();

  // Load orders from Firestore on mount
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const orderList: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(orderList);
        setLoading(false);
      },
      (err) => {
        console.error("Error getting orders:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Get a specific order by ID
  const getOrder = (orderId: string): Order | null => {
    return orders.find(order => order.id === orderId) || null;
  };

  // Add a new order
  const addOrder = async (order: Order): Promise<void> => {
    try {
      setLoading(true);
      // Add order to Firestore
      await addDoc(collection(db, 'orders'), {...order});
      toast.success("Order created successfully");
    } catch (err) {
      console.error("Error adding order:", err);
      setError("Failed to create order");
      toast.error("Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (order: Order): Promise<void> => {
    try {
      setLoading(true);
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', order.id), {...order});
      toast.success("Order updated successfully");
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order");
      toast.error("Failed to update order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      // Delete order from Firestore
      await deleteDoc(doc(db, 'orders', id));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order");
      toast.error("Failed to delete order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add status update to an order
  const addStatusUpdate = async (orderId: string, statusUpdate: Partial<StatusUpdate>): Promise<void> => {
    try {
      setLoading(true);
      
      const updateId = nanoid();
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const editableUntil = format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss'); // 30 minutes from now
      
      const statusUpdateWithDefaults: StatusUpdate = {
        id: updateId,
        orderId,
        timestamp,
        editableUntil,
        department: statusUpdate.department || (currentUser?.department as Department),
        status: statusUpdate.status || "In Progress" as OrderStatus,
        remarks: statusUpdate.remarks || "",
        updatedBy: statusUpdate.updatedBy || currentUser?.name || "Unknown",
        ...statusUpdate
      };
      
      // Get the order document
      const orderRef = doc(db, 'orders', orderId);
      const targetOrder = orders.find(o => o.id === orderId);
      
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      // Atomically add a new status update to the "statusHistory" array field.
      await updateDoc(orderRef, {
        statusHistory: [...targetOrder.statusHistory || [], statusUpdateWithDefaults],
        status: statusUpdate.status || targetOrder.status,
        currentDepartment: statusUpdate.department || targetOrder.currentDepartment
      });
      
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Error adding status update:", err);
      setError("Failed to add status update");
      toast.error("Failed to add status update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a status update
  const updateStatusUpdate = async (orderId: string, updateId: string, newData: Partial<StatusUpdate>): Promise<void> => {
    try {
      setLoading(true);
      
      const targetOrder = orders.find(o => o.id === orderId);
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      const updatedStatusHistory = targetOrder.statusHistory.map(update => 
        update.id === updateId ? { ...update, ...newData } : update
      );
      
      await updateDoc(doc(db, 'orders', orderId), {
        statusHistory: updatedStatusHistory
      });
      
      toast.success("Status update modified");
    } catch (err) {
      console.error("Error updating status update:", err);
      setError("Failed to update status");
      toast.error("Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Undo a status update
  const undoStatusUpdate = async (orderId: string, updateId: string): Promise<void> => {
    try {
      setLoading(true);
      
      const targetOrder = orders.find(o => o.id === orderId);
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      const updatedStatusHistory = targetOrder.statusHistory.filter(update => update.id !== updateId);
      
      await updateDoc(doc(db, 'orders', orderId), {
        statusHistory: updatedStatusHistory
      });
      
      // Optionally, update the current status to the previous one if we're undoing the latest update
      const wasLatestUpdate = targetOrder.statusHistory[targetOrder.statusHistory.length - 1].id === updateId;
      if (wasLatestUpdate && updatedStatusHistory.length > 0) {
        const previousStatus = updatedStatusHistory[updatedStatusHistory.length - 1].status;
        await updateDoc(doc(db, 'orders', orderId), {
          status: previousStatus
        });
      }
      
      toast.success("Status update undone");
    } catch (err) {
      console.error("Error undoing status update:", err);
      setError("Failed to undo status update");
      toast.error("Failed to undo status update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark order as Ready to Dispatch
  const markReadyForDispatch = async (orderId: string): Promise<void> => {
    try {
      setLoading(true);
      
      const orderRef = doc(db, 'orders', orderId);
      const targetOrder = orders.find(o => o.id === orderId);
      
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      // Update order status in Firestore
      await updateDoc(orderRef, { 
        status: "Ready to Dispatch" as OrderStatus,
        lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      });
      
      // Add status update
      await addStatusUpdate(orderId, {
        status: "Ready to Dispatch" as OrderStatus,
        remarks: "Order is ready for dispatch"
      });
      
      toast.success("Order marked as Ready for Dispatch");
    } catch (err) {
      console.error("Error marking order as Ready for Dispatch:", err);
      setError("Failed to mark order as Ready for Dispatch");
      toast.error("Failed to mark order as Ready for Dispatch");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify order for dispatch
  const verifyOrder = async (orderId: string, verificationData: any): Promise<void> => {
    try {
      setLoading(true);
      
      const orderRef = doc(db, 'orders', orderId);
      const targetOrder = orders.find(o => o.id === orderId);
      
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      await updateDoc(orderRef, {
        status: "Verified" as OrderStatus,
        verifiedBy: currentUser?.name || "Unknown",
        verifiedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...verificationData
      });
      
      await addStatusUpdate(orderId, {
        status: "Verified" as OrderStatus,
        remarks: `Order verified by ${currentUser?.name || "Unknown"}`
      });
      
      toast.success("Order verified successfully");
    } catch (err) {
      console.error("Error verifying order:", err);
      setError("Failed to verify order");
      toast.error("Failed to verify order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add payment record
  const addPayment = async (orderId: string, payment: PaymentRecord): Promise<void> => {
    try {
      setLoading(true);
      
      const orderRef = doc(db, 'orders', orderId);
      const targetOrder = orders.find(o => o.id === orderId);
      
      if (!targetOrder) {
        throw new Error("Order not found");
      }
      
      // Calculate new paid amount and payment status
      const newPaidAmount = targetOrder.paidAmount + payment.amount;
      const pendingAmount = targetOrder.amount - newPaidAmount;
      let paymentStatus = targetOrder.paymentStatus;
      
      if (pendingAmount <= 0) {
        paymentStatus = "Paid";
      } else if (newPaidAmount > 0) {
        paymentStatus = "Partial";
      }
      
      // Update order in Firestore
      await updateDoc(orderRef, {
        paymentHistory: [...targetOrder.paymentHistory || [], payment],
        paidAmount: newPaidAmount,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
        paymentStatus,
        lastPaymentDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      });
      
      // Add status update
      const paymentStatusRecord = paymentStatus === "Paid" 
        ? "Payment Recorded: Paid" as OrderStatus 
        : paymentStatus === "Partial" 
          ? "Payment Recorded: Partial" as OrderStatus 
          : "Payment Recorded: Not Paid" as OrderStatus;
          
      await addStatusUpdate(orderId, {
        status: paymentStatusRecord,
        remarks: `Payment of ₹${payment.amount} recorded via ${payment.method}. ${payment.remarks || ''}`
      });
      
      toast.success("Payment recorded successfully");
    } catch (err) {
      console.error("Error adding payment:", err);
      setError("Failed to add payment");
      toast.error("Failed to add payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete all orders - for Admin only
  const deleteAllOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Delete all orders from Firestore
      const deletePromises = orders.map(order => deleteDoc(doc(db, 'orders', order.id)));
      await Promise.all(deletePromises);
      
      toast.success("All orders have been deleted");
    } catch (err) {
      console.error("Error deleting all orders:", err);
      setError("Failed to delete all orders");
      toast.error("Failed to delete all orders");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add multiple orders at once - for CSV import
  const addMultipleOrders = async (newOrders: Order[]): Promise<void> => {
    try {
      setLoading(true);
      
      const addPromises = newOrders.map(order => addDoc(collection(db, 'orders'), {...order}));
      await Promise.all(addPromises);
      
      toast.success(`Successfully added ${newOrders.length} orders`);
    } catch (err) {
      console.error("Error adding multiple orders:", err);
      setError("Failed to add orders");
      toast.error("Failed to import orders");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on criteria
  const getFilteredOrders = (filters: OrderFilters): Order[] => {
    return orders.filter(order => {
      // Department filter
      if (filters.department && order.currentDepartment !== filters.department) {
        return false;
      }
      
      // Status filter
      if (filters.status && order.status !== filters.status) {
        return false;
      }
      
      // Payment status filter
      if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        if (orderDate < fromDate || orderDate > toDate) {
          return false;
        }
      }
      
      // Amount range filter
      if (filters.amountRange) {
        if (filters.amountRange.min !== undefined && order.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max !== undefined && order.amount > filters.amountRange.max) {
          return false;
        }
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.clientName.toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Sort orders based on criteria
  const getSortedOrders = (ordersToSort: Order[], sortBy: string, sortDirection: 'asc' | 'desc'): Order[] => {
    const sorted = [...ordersToSort];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case 'orderNumber':
          comparison = a.orderNumber.localeCompare(b.orderNumber);
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  // Check if user can see dashboard element
  const canUserSeeElement = (elementId: string): boolean => {
    if (!currentUser) return false;
    
    // Admin can see everything
    if (currentUser.role === 'Admin') return true;
    
    // Department-specific elements
    const elementVisibility: Record<string, string[]> = {
      'statusSummary': ['Admin', 'Sales', 'Design', 'Prepress', 'Production'],
      'financialSummary': ['Admin', 'Sales'],
      'recentOrders': ['Admin', 'Sales', 'Design', 'Prepress', 'Production'],
      'orderApprovals': ['Admin', 'Sales'],
      'taskList': ['Admin', 'Sales', 'Design', 'Prepress', 'Production'],
      'designTasksList': ['Admin', 'Design'],
      'prepressTasksList': ['Admin', 'Prepress'],
      'productionTasksList': ['Admin', 'Production'],
      'salesTasksList': ['Admin', 'Sales']
    };
    
    // Check if element exists in the visibility map
    if (elementVisibility[elementId]) {
      return elementVisibility[elementId].includes(currentUser.role) || 
             elementVisibility[elementId].includes(currentUser.department);
    }
    
    // Default to showing element if not specified
    return true;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        updateOrder,
        deleteOrder,
        addStatusUpdate,
        markReadyForDispatch,
        deleteAllOrders,
        addMultipleOrders,
        currentUser,
        getFilteredOrders,
        getSortedOrders,
        hasPermission,
        verifyOrder,
        addPayment,
        updateStatusUpdate,
        undoStatusUpdate,
        canUserSeeElement,
        getOrder,
        logout
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
