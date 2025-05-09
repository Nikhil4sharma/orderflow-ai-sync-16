
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification, Department, NotificationType } from '@/types';

type NotificationPriority = 'high' | 'medium' | 'low';
type NotificationCategory = 'order' | 'status' | 'payment' | 'user' | 'system';

export const createNotification = async ({
  title,
  message,
  priority = 'medium',
  category = 'system',
  orderId,
  userId,
  forDepartments,
  forRoles,
  data = {}
}: {
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  orderId?: string;
  userId?: string;
  forDepartments: Department[];
  forRoles?: string[];
  data?: Record<string, any>;
}) => {
  try {
    const notification: Omit<Notification, 'id'> = {
      title,
      message,
      priority,
      category,
      orderId,
      userId,
      forDepartments,
      forRoles,
      isRead: false,
      timestamp: new Date().toISOString(),
      type: category as NotificationType,
      data
    };

    await addDoc(collection(db, 'notifications'), notification);
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

// Common notification templates
export const notifyOrderCreated = (orderId: string, orderNumber: string, department: Department) => {
  return createNotification({
    title: 'New Order Created',
    message: `Order #${orderNumber} has been created and assigned to ${department}`,
    priority: 'high',
    category: 'order',
    orderId,
    forDepartments: [department, 'Admin']
  });
};

export const notifyOrderStatusChanged = (orderId: string, orderNumber: string, newStatus: string, department: Department) => {
  return createNotification({
    title: 'Order Status Updated',
    message: `Order #${orderNumber} status has been changed to ${newStatus}`,
    priority: 'medium',
    category: 'status',
    orderId,
    forDepartments: [department, 'Admin', 'Sales']
  });
};

export const notifyPaymentReceived = (orderId: string, orderNumber: string, amount: number) => {
  return createNotification({
    title: 'Payment Received',
    message: `Payment of ₹${amount} received for Order #${orderNumber}`,
    priority: 'high',
    category: 'payment',
    orderId,
    forDepartments: ['Admin', 'Sales']
  });
};

export const notifyUserCreated = (userId: string, userName: string, department: Department) => {
  return createNotification({
    title: 'New User Added',
    message: `${userName} has been added to ${department} department`,
    priority: 'medium',
    category: 'user',
    userId,
    forDepartments: ['Admin']
  });
};

export const notifySystemAlert = (message: string, priority: NotificationPriority = 'high') => {
  return createNotification({
    title: 'System Alert',
    message,
    priority,
    category: 'system',
    forDepartments: ['Admin']
  });
};
