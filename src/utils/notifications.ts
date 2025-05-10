
import { Department, OrderStatus } from "@/types/common";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const notifyOrderStatusChanged = async (
  orderId: string,
  orderNumber: string,
  newStatus: OrderStatus,
  department: Department
): Promise<void> => {
  try {
    // Log to console and show toast notification
    console.log(`Order ${orderNumber} status changed to ${newStatus}`);
    toast.success(`Order ${orderNumber} status changed to ${newStatus}`);
    
    // Create notification record in Firebase
    const notificationData = {
      id: nanoid(),
      title: `Order Status Update`,
      message: `Order #${orderNumber} status changed to ${newStatus}`,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      isRead: false,
      type: 'status_update',
      orderId: orderId,
      forDepartments: [department],
      priority: 'medium',
      category: 'status',
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Failed to send notification:", error);
    toast.error("Failed to send notification");
    return Promise.reject(error);
  }
};

export const notifyPaymentReceived = async (
  orderId: string,
  orderNumber: string,
  amount: number,
  paymentMethod: string = "Unknown"
): Promise<void> => {
  try {
    // Log to console and show toast notification
    console.log(`Payment of ₹${amount} received for order ${orderNumber}`);
    toast.success(`Payment of ₹${amount} received for order #${orderNumber}`);
    
    // Create notification record in Firebase
    const notificationData = {
      id: nanoid(),
      title: `Payment Received`,
      message: `Payment of ₹${amount} received for order #${orderNumber} via ${paymentMethod}`,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      isRead: false,
      type: 'payment_received',
      orderId: orderId,
      forDepartments: ['Sales', 'Admin'],
      priority: 'medium',
      category: 'payment',
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Failed to send payment notification:", error);
    toast.error("Failed to send notification");
    return Promise.reject(error);
  }
};

// Add user created notification function
export const notifyUserCreated = async (
  userId: string,
  userName: string,
  userRole: string,
  userDepartment: string
): Promise<void> => {
  try {
    // Log to console and show toast notification
    console.log(`New user ${userName} created as ${userRole} in ${userDepartment}`);
    toast.success(`New user ${userName} created successfully`);
    
    // Create notification record in Firebase
    const notificationData = {
      id: nanoid(),
      title: `New User Created`,
      message: `${userName} has been added as ${userRole} in ${userDepartment}`,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      isRead: false,
      type: 'user_created',
      userId: userId,
      forDepartments: ['Admin'],
      priority: 'low',
      category: 'user',
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Failed to send user creation notification:", error);
    toast.error("Failed to send notification");
    return Promise.reject(error);
  }
};
