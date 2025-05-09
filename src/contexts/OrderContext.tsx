import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, User, OrderStatus, StatusUpdate, Department, Role, PaymentRecord, PermissionKey, StatusType, PaymentStatus } from "@/types";
import { getDemoOrders } from "@/lib/demo-data";
import { DashboardConfiguration } from "@/types/dashboardConfig";
import { addHours, addMinutes } from "date-fns";
import { toast } from "sonner";
import { db, auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
  getDocs,
  writeBatch
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

// Define the context type
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (updatedOrder: Order) => void;
  deleteOrder: (orderId: string) => void;
  addStatusUpdate: (orderId: string, statusUpdate: Partial<StatusUpdate>) => void;
  updateStatusUpdate: (update: StatusUpdate) => void;
  undoStatusUpdate: (updateId: string) => void;
  addPayment: (orderId: string, payment: Partial<PaymentRecord>) => void;
  verifyOrder: (orderId: string) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  canUserSeeElement: (department: string, element: string) => boolean;
  hasPermission: (permission: string) => boolean;
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  dashboardConfig: DashboardConfiguration;
  updateDashboardConfig: (config: DashboardConfiguration) => void;
  forwardToDepartment: (orderId: string, targetDepartment: Department, remarks?: string) => Promise<void>;
  requestApproval: (orderId: string, fromDepartment: Department, reason: string) => Promise<void>;
  provideApproval: (orderId: string, approved: boolean, remarks?: string) => Promise<void>;
  updateProductStatus: (orderId: string, productId: string, status: StatusType, remarks?: string) => Promise<void>;
  markReadyForDispatch: (orderId: string, remarks?: string) => Promise<void>;
  getFilteredOrders: (filters: OrderFilters) => Order[];
  getSortedOrders: (orders: Order[], sortBy: OrderSortBy, sortDirection: 'asc' | 'desc') => Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, remarks: string) => Promise<void>;
}

// Add new types for filtering and sorting
interface OrderFilters {
  department?: Department;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateRange?: {
    from: Date;
    to: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

type OrderSortBy = 'date' | 'amount' | 'status' | 'clientName' | 'orderNumber';

// Create a context with an empty default value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>({
    departmentConfigs: {
      Sales: {
        department: 'Sales' as Department,
        visibleElements: [
          'financialSummary',
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'salesMetrics',
          'deliverySchedule'
        ]
      },
      Design: {
        department: 'Design' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList'
        ]
      },
      Prepress: {
        department: 'Prepress' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList'
        ]
      },
      Production: {
        department: 'Production' as Department,
        visibleElements: [
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'productionTimeline',
          'taskList'
        ]
      },
      Admin: {
        department: 'Admin' as Department,
        visibleElements: [
          'financialSummary',
          'orderApprovals',
          'recentOrders',
          'statusSummary',
          'taskList',
          'salesMetrics',
          'productionTimeline',
          'deliverySchedule'
        ]
      }
    }
  });

  const navigate = useNavigate();
  const { notifyOrderCreated, notifyStatusUpdate, notifyPayment } = useNotifications();

  // Listen for real-time order updates
  useEffect(() => {
    // Only setup listeners if user is authenticated
    if (!isAuthenticated) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    const setupOrderListener = () => {
      const ordersRef = collection(db, "orders");
      const unsubscribe = onSnapshot(ordersRef, 
        (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          setOrders(ordersData);
          retryCount = 0; // Reset retry count on successful update
        },
        (error) => {
          console.error("Error in real-time order sync:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(setupOrderListener, retryDelay);
            toast.error(`Connection lost. Retrying... (${retryCount}/${maxRetries})`);
          } else {
            toast.error("Failed to sync orders. Please refresh the page.");
          }
        }
      );

      return unsubscribe;
    };

    const unsubscribe = setupOrderListener();

    // Fallback polling with exponential backoff
    let pollInterval = 3000;
    const maxPollInterval = 30000;
    const pollMultiplier = 1.5;

    const pollOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const snapshot = await getDocs(ordersRef);
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
        pollInterval = Math.min(pollInterval * pollMultiplier, maxPollInterval);
      } catch (err) {
        console.error("Polling error:", err);
        pollInterval = Math.min(pollInterval * pollMultiplier, maxPollInterval);
      }
    };

    const pollIntervalId = setInterval(pollOrders, pollInterval);

    return () => {
      unsubscribe();
      clearInterval(pollIntervalId);
    };
  }, [isAuthenticated]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            setCurrentUser(userData);
            setIsAuthenticated(true);
          } else {
            // If user document doesn't exist, create one
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              role: "User" as Role,
              department: "Sales" as Department,
              permissions: ["update_order_status"] as PermissionKey[]
            };
            
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error loading user data");
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Utility to remove undefined fields from an object
  function removeUndefined(obj: any) {
    if (Array.isArray(obj)) return obj.map(removeUndefined);
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, removeUndefined(v)])
      );
    }
    return obj;
  }

  // Add a new order
  const addOrder = async (order: Order) => {
    try {
      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, {
        ...order,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        currentDepartment: 'Sales',
        status: 'In Progress'
      });
      // Set the id field in the document
      await updateDoc(docRef, { id: docRef.id });
      
      // Send notification
      await notifyOrderCreated(order);
      
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to create order");
    }
  };

  // Update an existing order
  const updateOrder = async (updatedOrder: Order) => {
    if (updatedOrder.currentDepartment === 'Production' && !updatedOrder.expectedCompletionDate) {
      throw new Error('Production must enter estimated timeline for completion');
    }
    try {
      if (!updatedOrder.id) {
        console.error("Order id is missing!", updatedOrder);
        toast.error("Order id is missing, cannot update order.");
        return;
      }
      // Remove undefined fields
      const cleanOrder = removeUndefined(updatedOrder);
      if (!cleanOrder.statusHistory) cleanOrder.statusHistory = [];
      if (!cleanOrder.paymentHistory) cleanOrder.paymentHistory = [];
      const orderRef = doc(db, "orders", updatedOrder.id);
      await updateDoc(orderRef, removeUndefined({
        ...cleanOrder,
        lastUpdated: serverTimestamp()
      }));
      // Send notification
      await notifyStatusUpdate(
        updatedOrder,
        updatedOrder.status,
        "Order updated"
      );
      toast.success("Order updated successfully");
    } catch (error: any) {
      console.error("Error updating order:", error, updatedOrder);
      toast.error("Failed to update order: " + (error?.message || error));
    }
  };

  // Delete an order
  const deleteOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await deleteDoc(orderRef);
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };
  
  // Add a status update to an order
  const addStatusUpdate = async (orderId: string, statusUpdate: Partial<StatusUpdate>) => {
    try {
      if (!orderId) throw new Error("OrderId is missing");
      const orderRef = doc(db, "orders", orderId);
      const now = new Date();
      
      // Create a new status update with timestamp and metadata
      const newUpdate: StatusUpdate = {
        id: `status-${Date.now()}`,
        orderId: orderId,
        timestamp: now.toISOString(),
        department: statusUpdate.department || currentUser?.department || "Admin",
        status: statusUpdate.status || "New",
        remarks: statusUpdate.remarks || "",
        updatedBy: currentUser?.name || "System",
        estimatedTime: statusUpdate.estimatedTime || "",
        selectedProduct: statusUpdate.selectedProduct,
        editableUntil: currentUser?.role === "Admin" ? 
          addHours(now, 24 * 365).toISOString() : 
          addHours(now, 1).toISOString(),
        metadata: {
          updatedAt: now.toISOString(),
          updatedBy: currentUser?.id || "system",
          department: currentUser?.department || "Admin",
          role: currentUser?.role || "User"
        }
      };

      // Get current order data
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;
      let statusHistory: StatusUpdate[] = [];
      
      // Safely get existing status history
      if (orderDoc.exists() && Array.isArray(orderDoc.data().statusHistory)) {
        statusHistory = orderDoc.data().statusHistory.filter(Boolean);
      }

      // Add new status update
      statusHistory.push(newUpdate);

      // Update order with new status and history
      const batch = writeBatch(db);
      batch.update(orderRef, removeUndefined({
        statusHistory,
        status: newUpdate.status,
        lastUpdated: serverTimestamp(),
        currentDepartment: newUpdate.department,
        timeline: {
          ...order.timeline,
          [newUpdate.status]: {
            timestamp: now.toISOString(),
            remarks: newUpdate.remarks,
            updatedBy: newUpdate.updatedBy
          }
        }
      }));

      await batch.commit();

      // Send notification
      await notifyStatusUpdate(
        order,
        newUpdate.status,
        `Status updated to ${newUpdate.status}: ${newUpdate.remarks}`
      );

      toast.success("Status updated successfully");
    } catch (error: any) {
      console.error("Error adding status update:", error, orderId, statusUpdate);
      toast.error("Failed to update status: " + (error?.message || error));
    }
  };

  // Update order status with timeline tracking
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, remarks: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;
      const now = new Date();

      // Create status update
      const statusUpdate: StatusUpdate = {
        id: `status-${Date.now()}`,
        orderId,
        timestamp: now.toISOString(),
        department: currentUser?.department || "Admin",
        status: newStatus,
        remarks,
        updatedBy: currentUser?.name || "System",
        metadata: {
          updatedAt: now.toISOString(),
          updatedBy: currentUser?.id || "system",
          department: currentUser?.department || "Admin",
          role: currentUser?.role || "User"
        }
      };

      // Update order with new status and timeline
      const batch = writeBatch(db);
      batch.update(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
        statusHistory: [...(order.statusHistory || []), statusUpdate],
        timeline: {
          ...order.timeline,
          [newStatus]: {
            timestamp: now.toISOString(),
            remarks,
            updatedBy: currentUser?.name || "System"
          }
        }
      });

      await batch.commit();

      // Send notification
      await notifyStatusUpdate(
        order,
        newStatus,
        `Status updated to ${newStatus}: ${remarks}`
      );

      toast.success("Order status updated successfully");
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status: " + (error?.message || error));
    }
  };

  // Update a status update
  const updateStatusUpdate = (update: StatusUpdate) => {
    const now = new Date();
    
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== update.orderId) return order;
        
        // Update the status history
        return {
          ...order,
          statusHistory: order.statusHistory.map(statusUpdate => 
            statusUpdate.id === update.id ? 
            {
              ...update,
              updatedAt: now.toISOString(), // Track when the update was edited
            } : 
            statusUpdate
          ),
          lastUpdated: now.toISOString(),
        };
      })
    );
    
    toast.success("Status update modified successfully");
  };
  
  // Undo (delete) a status update
  const undoStatusUpdate = (updateId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        // Find if this order contains the update
        const hasUpdate = order.statusHistory.some(update => update.id === updateId);
        
        if (!hasUpdate) return order;
        
        // Remove the specified update from history
        const updatedHistory = order.statusHistory.filter(update => update.id !== updateId);
        
        // If this was the only update, we need to keep at least the initial state
        if (updatedHistory.length === 0) {
          return order;
        }
        
        // Get the most recent status after removing the undone update
        const latestUpdate = updatedHistory[updatedHistory.length - 1];
        
        // Update order status based on latest remaining update
        return {
          ...order,
          status: latestUpdate.status as OrderStatus,
          statusHistory: updatedHistory,
          lastUpdated: new Date().toISOString(),
        };
      })
    );
    
    toast.success("Status update has been undone");
  };

  // Add payment record to an order
  const addPayment = async (orderId: string, payment: Partial<PaymentRecord>) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;
      
      // Create new payment record
      const newPayment: PaymentRecord = {
        id: `payment-${Date.now()}`,
        amount: payment.amount || 0,
        date: payment.date || new Date().toISOString(),
        method: payment.method || "Not specified",
        remarks: payment.remarks || ""
      };
      
      // Calculate new paid and pending amounts
      const newPaidAmount = order.paidAmount + (payment.amount || 0);
      const newPendingAmount = Math.max(0, order.amount - newPaidAmount);
      
      // Determine new payment status
      let newPaymentStatus = order.paymentStatus;
      if (newPendingAmount <= 0) {
        newPaymentStatus = "Paid";
      } else if (newPaidAmount > 0) {
        newPaymentStatus = "Partial";
      }
      
      // Update order with new payment
      await updateDoc(orderRef, {
        paidAmount: newPaidAmount,
        pendingAmount: newPendingAmount,
        paymentStatus: newPaymentStatus,
        paymentHistory: [...(order.paymentHistory || []), newPayment],
        lastPaymentDate: new Date().toISOString(),
        lastUpdated: serverTimestamp()
      });

      // Send notification
      await notifyPayment(
        order,
        payment.amount || 0,
        newPaymentStatus
      );

      toast.success("Payment added successfully");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    }
  };
  
  // Verify an order
  const verifyOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        return {
          ...order,
          status: "Verified" as OrderStatus,
        };
      })
    );
    
    // Add verification status update
    addStatusUpdate(orderId, {
      status: "Verified",
      remarks: "Order verified by " + currentUser?.name,
    });
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        setCurrentUser(userData);
        setIsAuthenticated(true);
        toast.success("Welcome back, " + userData.name);
        navigate("/dashboard");
        return true;
      } else {
        toast.error("User data not found");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  // Alternative login function for LoginForm component
  const loginUser = async (email: string, password: string): Promise<void> => {
    const success = await login(email, password);
    if (!success) {
      throw new Error("Invalid credentials");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };
  
  // Check if a user's department can see a specific dashboard element
  const canUserSeeElement = (department: string, element: string): boolean => {
    // Simplified implementation
    const defaultPermissions = {
      "Admin": ["orders", "sales", "production", "design", "prepress", "finance"],
      "Sales": ["orders", "sales", "finance"],
      "Design": ["orders", "design"],
      "Production": ["orders", "production"],
      "Prepress": ["orders", "prepress"]
    };
    
    // @ts-ignore - Type safety for the mock implementation
    return defaultPermissions[department]?.includes(element) || false;
  };

  // Check if current user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === "Admin") return true;
    
    // Check if the user has the specific permission
    return currentUser.permissions?.includes(permission as any) || false;
  };

  // Add a user
  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  // Remove a user
  const removeUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  // Update dashboard config
  const updateDashboardConfig = (config: DashboardConfiguration) => {
    setDashboardConfig(config);
  };

  // Forward order to another department
  const forwardToDepartment = async (orderId: string, targetDepartment: Department, remarks?: string) => {
    try {
      if (!orderId || !targetDepartment) throw new Error("OrderId or targetDepartment missing");
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const order = orderDoc.data() as Order;
      // Role/department checks
      if (order.currentDepartment === 'Design') {
        if (targetDepartment === 'Prepress') {
          // Allowed
          order.designStatus = 'Forwarded to Prepress';
          order.status = 'In Progress';
        } else if (targetDepartment === 'Sales') {
          // Only approval request allowed, not direct forward
          throw new Error('Design can only send for approval to Sales or forward to Prepress');
        }
      } else if (order.currentDepartment === 'Prepress') {
        if (targetDepartment === 'Production') {
          if (order.status !== 'In Progress' || order.prepressStatus !== 'Working on it') {
            throw new Error('Prepress must get Sales approval before forwarding to Production');
          }
          order.prepressStatus = 'Forwarded to production';
          order.status = 'In Progress';
        } else if (targetDepartment === 'Sales') {
          // Only approval request allowed
          throw new Error('Prepress can only send for approval to Sales or forward to Production after approval');
        }
      } else if (order.currentDepartment === 'Production') {
        // Only allow Ready to Dispatch if paymentStatus is Paid
        if (targetDepartment === 'Production' && order.status === 'Ready to Dispatch') {
          if (order.paymentStatus !== 'Paid') {
            throw new Error('Order cannot proceed from Ready to Dispatch unless full payment is confirmed');
          }
          order.status = 'Ready to Dispatch';
        }
      }
      await updateDoc(orderRef, {
        currentDepartment: targetDepartment,
        status: order.status,
        lastUpdated: serverTimestamp()
      });
      await addStatusUpdate(orderId, {
        department: targetDepartment,
        status: order.status,
        remarks: remarks, // Only user-provided remarks
        editableUntil: null
      });
      await notifyStatusUpdate(
        order,
        order.status,
        `Forwarded to ${targetDepartment}${remarks ? `: ${remarks}` : ""}`
      );
      toast.success(`Order forwarded to ${targetDepartment}`);
    } catch (error: any) {
      console.error("Error forwarding order:", error, orderId, targetDepartment);
      toast.error("Failed to forward order: " + (error?.message || error));
    }
  };

  // Request approval from another department
  const requestApproval = async (orderId: string, fromDepartment: Department, reason: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const order = orderDoc.data() as Order;
      
      // Update order with approval request
      await updateDoc(orderRef, {
        status: "Pending Approval",
        pendingApprovalFrom: fromDepartment,
        approvalReason: reason,
        lastUpdated: serverTimestamp()
      });

      // Add status update
      await addStatusUpdate(orderId, {
        department: fromDepartment,
        status: "Pending Approval",
        remarks: `Approval requested from ${fromDepartment}: ${reason}`,
        editableUntil: null
      });

      // Send notification
      await notifyStatusUpdate(
        order,
        "Pending Approval",
        `Approval requested from ${fromDepartment}: ${reason}`
      );

      toast.success(`Approval requested from ${fromDepartment}`);
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast.error("Failed to request approval");
    }
  };

  // Provide approval for an order
  const provideApproval = async (orderId: string, approved: boolean, remarks?: string) => {
    try {
      if (!orderId) throw new Error("OrderId is missing");
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const order = orderDoc.data() as Order;
      if (order.designStatus === 'Pending Feedback from Sales Team') {
        order.designStatus = approved ? 'Working on it' : 'Working on it'; // fallback to allowed value
        order.status = approved ? 'In Progress' : 'On Hold';
      } else if (order.prepressStatus === 'Waiting for approval') {
        order.prepressStatus = approved ? 'Working on it' : 'Working on it'; // fallback to allowed value
        order.status = approved ? 'In Progress' : 'On Hold';
      }
      await updateDoc(orderRef, {
        status: order.status,
        pendingApprovalFrom: null,
        approvalReason: null,
        lastUpdated: serverTimestamp()
      });
      await addStatusUpdate(orderId, {
        department: order.currentDepartment,
        status: order.status,
        remarks: `Approval ${approved ? "granted" : "rejected"}${remarks ? `: ${remarks}` : ""}`,
        editableUntil: null
      });
      await notifyStatusUpdate(
        order,
        order.status,
        `Approval ${approved ? "granted" : "rejected"}${remarks ? `: ${remarks}` : ""}`
      );
      toast.success(`Approval ${approved ? "granted" : "rejected"}`);
    } catch (error: any) {
      console.error("Error providing approval:", error, orderId, approved);
      toast.error("Failed to provide approval: " + (error?.message || error));
    }
  };

  // Update product status
  const updateProductStatus = async (orderId: string, productId: string, status: StatusType, remarks?: string) => {
    try {
      if (!orderId || !productId) throw new Error("OrderId or productId missing");
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const order = orderDoc.data() as Order;
      const updatedProductStatus = order.productStatus?.map(product => 
        product.id === productId 
          ? { ...product, status, remarks: remarks || product.remarks }
          : product
      ) || [];
      await updateDoc(orderRef, {
        productStatus: updatedProductStatus,
        lastUpdated: serverTimestamp()
      });
      await addStatusUpdate(orderId, {
        department: order.currentDepartment,
        status: "In Progress",
        remarks: `Product ${productId} status updated to ${status}${remarks ? `: ${remarks}` : ""}`,
        selectedProduct: productId
      });
      await notifyStatusUpdate(
        order,
        "In Progress",
        `Product ${productId} status updated to ${status}${remarks ? `: ${remarks}` : ""}`
      );
      toast.success("Product status updated");
    } catch (error: any) {
      console.error("Error updating product status:", error, orderId, productId);
      toast.error("Failed to update product status: " + (error?.message || error));
    }
  };

  // Mark order ready for dispatch
  const markReadyForDispatch = async (orderId: string, remarks?: string) => {
    try {
      if (!orderId) throw new Error("OrderId is missing");
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }
      const order = orderDoc.data() as Order;
      if (order.paymentStatus !== "Paid") {
        toast.error("Cannot mark ready for dispatch: Payment not complete");
        return;
      }
      await updateDoc(orderRef, {
        status: "Ready to Dispatch",
        lastUpdated: serverTimestamp()
      });
      await addStatusUpdate(orderId, {
        department: order.currentDepartment,
        status: "Ready to Dispatch",
        remarks: `Ready for dispatch${remarks ? `: ${remarks}` : ""}`,
        editableUntil: null
      });
      await notifyStatusUpdate(
        order,
        "Ready to Dispatch",
        `Ready for dispatch${remarks ? `: ${remarks}` : ""}`
      );
      toast.success("Order marked ready for dispatch");
    } catch (error: any) {
      console.error("Error marking ready for dispatch:", error, orderId);
      toast.error("Failed to mark ready for dispatch: " + (error?.message || error));
    }
  };

  // Get filtered orders
  const getFilteredOrders = (filters: OrderFilters): Order[] => {
    return orders.filter(order => {
      // Filter by department
      if (filters.department && order.currentDepartment !== filters.department) {
        return false;
      }

      // Filter by status
      if (filters.status && order.status !== filters.status) {
        return false;
      }

      // Filter by payment status
      if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filters.dateRange.from);
        const endDate = new Date(filters.dateRange.to);
        if (orderDate < startDate || orderDate > endDate) {
          return false;
        }
      }

      // Filter by amount range
      if (filters.amountRange) {
        if (
          (filters.amountRange.min !== undefined && order.amount < filters.amountRange.min) ||
          (filters.amountRange.max !== undefined && order.amount > filters.amountRange.max)
        ) {
          return false;
        }
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.clientName.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  // Get sorted orders
  const getSortedOrders = (orders: Order[], sortBy: OrderSortBy, sortDirection: 'asc' | 'desc'): Order[] => {
    return [...orders].sort((a, b) => {
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
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Provide the context value
  const contextValue: OrderContextType = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addStatusUpdate,
    updateStatusUpdate,
    undoStatusUpdate,
    addPayment,
    verifyOrder,
    isAuthenticated,
    currentUser,
    login,
    loginUser,
    logout,
    setCurrentUser,
    canUserSeeElement,
    hasPermission,
    users,
    addUser,
    removeUser,
    dashboardConfig,
    updateDashboardConfig,
    forwardToDepartment,
    requestApproval,
    provideApproval,
    updateProductStatus,
    markReadyForDispatch,
    getFilteredOrders,
    getSortedOrders,
    updateOrderStatus
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the context
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
