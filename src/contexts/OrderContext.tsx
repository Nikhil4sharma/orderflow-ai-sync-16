import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
// Import OrderFilters from types
import { Order, Department, OrderStatus, User, OrderFilters } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useUsers } from './UserContext';
import { createOrder, updateOrderStatus } from '@/utils/orderWorkflow';
import { format } from 'date-fns';

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Order | undefined;
  currentUser: User | null;
  hasPermission: (permission: string) => boolean;
  addStatusUpdate: (orderId: string, statusUpdate: { department: Department; status: OrderStatus; remarks: string }) => Promise<void>;
  undoStatusUpdate: (updateId: string) => Promise<void>;
  updateStatusUpdate: (updateId: string, newData: any) => Promise<void>;
  addPayment: (orderId: string, payment: any) => Promise<void>;
  filters: OrderFilters;
  setFilters: React.Dispatch<React.SetStateAction<OrderFilters>>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: false,
  error: null,
  addOrder: async () => {},
  updateOrder: async () => {},
  deleteOrder: async () => {},
  getOrder: () => undefined,
  currentUser: null,
  hasPermission: () => false,
  addStatusUpdate: async () => {},
  undoStatusUpdate: async () => {},
  updateStatusUpdate: async () => {},
  addPayment: async () => {},
  filters: {},
  setFilters: () => {}
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUsers();
  const [filters, setFilters] = useState<OrderFilters>({});

  useEffect(() => {
    // Mock data loading for demo purposes
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      // Load mock orders
      const mockOrders = [
        {
          id: uuidv4(),
          orderNumber: 'ORD-12345',
          clientName: 'John Doe',
          amount: 500,
          paidAmount: 200,
          pendingAmount: 300,
          items: ['Product A', 'Product B'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: 'In Progress',
          currentDepartment: 'Sales',
          paymentStatus: 'Partial',
          statusHistory: [],
          paymentHistory: [],
        },
        {
          id: uuidv4(),
          orderNumber: 'ORD-67890',
          clientName: 'Jane Smith',
          amount: 1200,
          paidAmount: 1200,
          pendingAmount: 0,
          items: ['Product C', 'Product D', 'Product E'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: 'Completed',
          currentDepartment: 'Production',
          paymentStatus: 'Paid',
          statusHistory: [],
          paymentHistory: [],
        },
      ];
      setOrders(mockOrders);
    } else {
      // Fetch orders from Firebase (replace with your actual Firebase fetching logic)
      // const fetchOrders = async () => {
      //   setLoading(true);
      //   try {
      //     // Fetch data from Firebase
      //     // setOrders(fetchedOrders);
      //   } catch (err: any) {
      //     setError(err);
      //     toast.error('Failed to fetch orders');
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchOrders();
    }
  }, []);

  const addOrder = useCallback(async (order: Order) => {
    setLoading(true);
    try {
      // Add order to Firebase or mock store
      const newOrder = await createOrder(order, currentUser?.name || 'Unknown');
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      toast.success('Order created successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const updateOrder = useCallback(async (order: Order) => {
    setLoading(true);
    try {
      // Update order in Firebase or mock store
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === order.id ? order : o))
      );
      toast.success('Order updated successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      // Delete order from Firebase or mock store
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to delete order');
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback((orderId: string) => {
    return orders.find((order) => order.id === orderId);
  }, [orders]);

  const hasPermission = (permission: string) => {
    return currentUser?.permissions?.includes(permission);
  };

  const addStatusUpdate = async (orderId: string, statusUpdate: { department: Department; status: OrderStatus; remarks: string }) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const newUpdate = {
      id: uuidv4(),
      orderId: order.id,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      department: statusUpdate.department,
      status: statusUpdate.status,
      remarks: statusUpdate.remarks,
      updatedBy: currentUser?.name || 'Unknown',
      editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss'),
    };

    const updatedHistory = [...(order.statusHistory || []), newUpdate];
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory,
        lastUpdated: new Date().toISOString(),
      });
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error adding status update:', error);
      toast.error('Failed to update status');
    }
  };

  const undoStatusUpdate = async (updateId: string) => {
    setLoading(true);
    try {
      // Find the order that contains the status update
      const orderToUpdate = orders.find(order =>
        order.statusHistory.some(update => update.id === updateId)
      );
  
      if (!orderToUpdate) {
        toast.error('Status update not found');
        return;
      }
  
      // Filter out the status update to be undone
      const updatedHistory = orderToUpdate.statusHistory.filter(
        update => update.id !== updateId
      );
  
      // Update the order with the modified status history
      const updatedOrder = {
        ...orderToUpdate,
        statusHistory: updatedHistory,
        lastUpdated: new Date().toISOString(),
      };
  
      // Update the order in the orders state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
  
      toast.success('Status update undone successfully');
    } catch (error) {
      console.error('Error undoing status update:', error);
      toast.error('Failed to undo status update');
    } finally {
      setLoading(false);
    }
  };

  const updateStatusUpdate = async (updateId: string, newData: any) => {
    setLoading(true);
    try {
      // Find the order that contains the status update
      const orderToUpdate = orders.find(order =>
        order.statusHistory.some(update => update.id === updateId)
      );
  
      if (!orderToUpdate) {
        toast.error('Status update not found');
        return;
      }
  
      // Map through the status history and update the matching item
      const updatedHistory = orderToUpdate.statusHistory.map(update =>
        update.id === updateId ? { ...update, ...newData } : update
      );
  
      // Create a new order object with the updated status history
      const updatedOrder = {
        ...orderToUpdate,
        statusHistory: updatedHistory,
        lastUpdated: new Date().toISOString(),
      };
  
      // Update the order in the orders state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
  
      toast.success('Status update updated successfully');
    } catch (error) {
      console.error('Error updating status update:', error);
      toast.error('Failed to update status update');
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (orderId: string, payment: any) => {
    setLoading(true);
    try {
      // Find the order to add the payment to
      const orderToUpdate = orders.find(order => order.id === orderId);
      
      if (!orderToUpdate) {
        toast.error('Order not found');
        return;
      }
      
      // Add the new payment to the paymentHistory array
      const updatedPaymentHistory = [...(orderToUpdate.paymentHistory || []), payment];
      
      // Calculate the updated paidAmount and pendingAmount
      let updatedPaidAmount = orderToUpdate.paidAmount + payment.amount;
      let updatedPendingAmount = orderToUpdate.amount - updatedPaidAmount;
      
      // Ensure amounts are not negative
      updatedPaidAmount = Math.max(updatedPaidAmount, 0);
      updatedPendingAmount = Math.max(updatedPendingAmount, 0);
      
      // Determine the new paymentStatus based on the updated amounts
      let updatedPaymentStatus: Order['paymentStatus'] = 'Partial';
      if (updatedPendingAmount <= 0) {
        updatedPaymentStatus = 'Paid';
      } else if (updatedPaidAmount === 0) {
        updatedPaymentStatus = 'Not Paid';
      }
      
      // Create a new order object with the updated payment history and amounts
      const updatedOrder = {
        ...orderToUpdate,
        paymentHistory: updatedPaymentHistory,
        paidAmount: updatedPaidAmount,
        pendingAmount: updatedPendingAmount,
        paymentStatus: updatedPaymentStatus,
        lastUpdated: new Date().toISOString(),
      };
      
      // Update the order in the orders state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      
      toast.success('Payment added successfully');
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Failed to add payment');
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
        getOrder,
        currentUser,
        hasPermission,
        addStatusUpdate,
        undoStatusUpdate,
        updateStatusUpdate,
        addPayment,
        filters,
        setFilters
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
