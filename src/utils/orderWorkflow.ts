import { Department, Order, OrderStatus } from "@/types";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { notifyOrderStatusChanged } from "./notifications";

// Demo login function - replace with real authentication later
export const demoLogin = async (email: string, password: string) => {
  // For demonstration purposes only
  if (email === "admin@example.com" && password === "password") {
    return {
      user: {
        id: "admin-user-id",
        name: "Admin User",
        email: "admin@example.com",
        department: "Admin",
        role: "Admin",
        permissions: ["view_orders", "create_orders", "update_orders"]
      }
    };
  }
  
  if (email === "sales@example.com" && password === "password") {
    return {
      user: {
        id: "sales-user-id",
        name: "Sales User",
        email: "sales@example.com",
        department: "Sales",
        role: "Staff",
        permissions: ["view_orders", "create_orders"]
      }
    };
  }
  
  if (email === "design@example.com" && password === "password") {
    return {
      user: {
        id: "design-user-id",
        name: "Design User",
        email: "design@example.com",
        department: "Design",
        role: "Staff",
        permissions: ["view_orders"]
      }
    };
  }
  
  if (email === "prepress@example.com" && password === "password") {
    return {
      user: {
        id: "prepress-user-id",
        name: "Prepress User", 
        email: "prepress@example.com",
        department: "Prepress",
        role: "Staff",
        permissions: ["view_orders"]
      }
    };
  }
  
  if (email === "production@example.com" && password === "password") {
    return {
      user: {
        id: "production-user-id",
        name: "Production User",
        email: "production@example.com",
        department: "Production",
        role: "Staff",
        permissions: ["view_orders"]
      }
    };
  }
  
  throw new Error("Invalid credentials");
};

// Function to update order status with proper workflow logic
export const updateOrderStatus = async (
  order: Order,
  newStatus: OrderStatus,
  remarks: string = "",
  updatedBy: string,
  userDepartment: Department
): Promise<Order> => {
  try {
    // Start with a copy of the order
    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };

    // Create status update object
    const statusUpdate = {
      id: nanoid(),
      orderId: order.id,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      department: userDepartment,
      status: newStatus,
      remarks,
      updatedBy,
      editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss') // 30 minutes
    };

    // Handle department-specific workflow logic
    if (newStatus === "Forwarded to Design" as OrderStatus) {
      updatedOrder.currentDepartment = "Design";
      updatedOrder.status = "Pending Design" as OrderStatus;
    } 
    else if (newStatus === "Approval Requested" as OrderStatus) {
      updatedOrder.pendingApprovalFrom = "Sales";
      updatedOrder.status = "Pending Approval";
    }
    else if (newStatus === "Design Approved" as OrderStatus) {
      // Design has been approved, update status accordingly
      updatedOrder.designStatus = "Forwarded to Prepress";
      updatedOrder.currentDepartment = "Prepress";
      updatedOrder.status = "Pending Prepress" as OrderStatus;
      delete updatedOrder.pendingApprovalFrom;
    }
    else if (newStatus === "Design Rejected" as OrderStatus) {
      // Design rejected, send back to Design
      updatedOrder.designStatus = "Working on it";
      updatedOrder.status = "In Progress";
      updatedOrder.currentDepartment = "Design";
      delete updatedOrder.pendingApprovalFrom;
    }
    else if (newStatus === "Prepress Approved" as OrderStatus) {
      // Prepress approved, send to Production
      updatedOrder.prepressStatus = "Forwarded to production";
      updatedOrder.currentDepartment = "Production";
      updatedOrder.status = "New";
      delete updatedOrder.pendingApprovalFrom;
    }
    else if (newStatus === "Prepress Rejected" as OrderStatus) {
      // Prepress rejected, send back to Prepress
      updatedOrder.prepressStatus = "Working on it";
      updatedOrder.status = "In Progress";
      updatedOrder.currentDepartment = "Prepress";
      delete updatedOrder.pendingApprovalFrom;
    }
    else if (newStatus === "Forwarded to Prepress" as OrderStatus) {
      // Design is sending to Prepress
      updatedOrder.currentDepartment = "Prepress";
      updatedOrder.status = "Pending Prepress" as OrderStatus;
    }
    else if (newStatus === "Forwarded to Production" as OrderStatus) {
      // Prepress is sending to Production
      updatedOrder.currentDepartment = "Production";
      updatedOrder.status = "New";
    }
    
    // Update the order in Firestore (or for demo, just simulate it)
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      // Demo mode - in real app, this would update Firestore
      console.log("Demo mode: Updating order status", newStatus);
      
      // Add the status update to the order's statusHistory
      updatedOrder.statusHistory = [...(updatedOrder.statusHistory || []), statusUpdate];
      
      // Notify about the status change
      await notifyOrderStatusChanged(order.id, order.orderNumber, newStatus, order.currentDepartment);
      
      return updatedOrder;
    } else {
      // Real Firebase mode
      const orderRef = doc(db, "orders", order.id);
      
      // Add the status update to the order's statusHistory
      updatedOrder.statusHistory = [...(updatedOrder.statusHistory || []), statusUpdate];
      
      // Update the order document in Firestore
      await updateDoc(orderRef, updatedOrder);
      
      // Notify about the status change
      await notifyOrderStatusChanged(order.id, order.orderNumber, newStatus, order.currentDepartment);
      
      return updatedOrder;
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Function to create a new order
export const createOrder = async (order: Partial<Order>, createdBy: string): Promise<Order> => {
  try {
    const newOrder: Order = {
      id: nanoid(),
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      clientName: order.clientName || "Unknown Client",
      amount: order.amount || 0,
      paidAmount: order.paidAmount || 0,
      pendingAmount: (order.amount || 0) - (order.paidAmount || 0),
      items: order.items || [],
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      lastUpdated: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      status: "New",
      currentDepartment: "Sales",
      paymentStatus: (order.paidAmount || 0) >= (order.amount || 0) ? "Paid" : 
                    (order.paidAmount || 0) > 0 ? "Partial" : "Not Paid",
      statusHistory: [{
        id: nanoid(),
        orderId: nanoid(), // This will be replaced with the actual order ID
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        department: "Sales",
        status: "New",
        remarks: "Order created",
        updatedBy: createdBy,
        editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss')
      }],
      paymentHistory: [],
      ...order
    };

    // Update the orderId in statusHistory
    newOrder.statusHistory[0].orderId = newOrder.id;
    
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_FIREBASE) {
      // Demo mode - in real app, this would add to Firestore
      console.log("Demo mode: Creating new order", newOrder);
      return newOrder;
    } else {
      // Real Firebase mode
      const orderRef = await addDoc(collection(db, "orders"), newOrder);
      return { ...newOrder, id: orderRef.id };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
