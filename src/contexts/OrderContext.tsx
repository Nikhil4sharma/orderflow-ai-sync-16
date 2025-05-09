import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, StatusUpdate, Department, User } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { User as FirebaseUser } from 'firebase/auth';

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => Promise<void>;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  markReadyForDispatch: (orderId: string) => Promise<void>;
  deleteAllOrders: () => Promise<void>;
  addMultipleOrders: (orders: Order[]) => Promise<void>;
};

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: false,
  error: null,
  addOrder: async () => {},
  updateOrder: async () => {},
  deleteOrder: async () => {},
  addStatusUpdate: async () => {},
  currentUser: null,
  setCurrentUser: () => {},
  markReadyForDispatch: async () => {},
  deleteAllOrders: async () => {},
  addMultipleOrders: async () => {},
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new order
  const addOrder = async (order: Order): Promise<void> => {
    try {
      setLoading(true);
      // Add order to Firestore
      await addDoc(collection(db, 'orders'), order);
      toast.success("Order created successfully");
    } catch (err) {
      console.error("Error adding order:", err);
      setError("Failed to create order");
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (order: Order): Promise<void> => {
    try {
      setLoading(true);
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', order.id), order);
      
      // Optimistically update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === order.id ? order : o))
      );
      
      toast.success("Order updated successfully");
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order");
      toast.error("Failed to update order");
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
      const statusUpdateWithDefaults = {
        id: updateId,
        orderId: orderId,
        timestamp: timestamp,
        ...statusUpdate,
      };
      
      // Get the order document
      const orderRef = doc(db, 'orders', orderId);
      
      // Atomically add a new status update to the "statusHistory" array field.
      await updateDoc(orderRef, {
        statusHistory: [...orders.find(o => o.id === orderId)?.statusHistory || [], statusUpdateWithDefaults]
      });
      
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Error adding status update:", err);
      setError("Failed to add status update");
      toast.error("Failed to add status update");
    } finally {
      setLoading(false);
    }
  };

  // Mark order as Ready to Dispatch
  const markReadyForDispatch = async (orderId: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Update order in Firestore
      await updateDoc(doc(db, 'orders', orderId), { status: "Ready to Dispatch" });
      
      toast.success("Order marked as Ready for Dispatch");
    } catch (err) {
      console.error("Error marking order as Ready for Dispatch:", err);
      setError("Failed to mark order as Ready for Dispatch");
      toast.error("Failed to mark order as Ready for Dispatch");
    } finally {
      setLoading(false);
    }
  };

  // Delete all orders - new function for Admin
  const deleteAllOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      // Confirm with user
      if (!window.confirm("Are you sure you want to delete ALL orders? This action cannot be undone!")) {
        return;
      }
      
      // Delete all orders from Firestore
      for (const order of orders) {
        await deleteDoc(doc(db, 'orders', order.id));
      }
      
      setOrders([]);
      toast.success("All orders have been deleted");
    } catch (err) {
      console.error("Error deleting all orders:", err);
      setError("Failed to delete all orders");
      toast.error("Failed to delete all orders");
    } finally {
      setLoading(false);
    }
  };

  // Add multiple orders at once - for CSV import
  const addMultipleOrders = async (newOrders: Order[]): Promise<void> => {
    try {
      setLoading(true);
      
      for (const order of newOrders) {
        // Add order to Firestore
        await addDoc(collection(db, 'orders'), order);
      }
      
      // Refresh orders list (will happen via snapshot listener)
      toast.success(`Successfully added ${newOrders.length} orders`);
    } catch (err) {
      console.error("Error adding multiple orders:", err);
      setError("Failed to add orders");
      toast.error("Failed to import orders");
    } finally {
      setLoading(false);
    }
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
        currentUser,
        setCurrentUser,
        markReadyForDispatch,
        deleteAllOrders,
        addMultipleOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
