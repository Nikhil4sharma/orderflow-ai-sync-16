import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification, NotificationPriority, NotificationCategory } from '@/types';

export const createNotification = async ({
  title,
  message,
  priority = 'medium',
  category = 'system',
  orderId,
  userId,
  department,
  data = {}
}: {
  title: string;
  message: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  orderId?: string;
  userId?: string;
  department?: string;
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
      department,
      read: false,
      createdAt: new Date().toISOString(),
      data
    };

    await addDoc(collection(db, 'notifications'), notification);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Common notification templates
export const notifyOrderCreated = (orderId: string, orderNumber: string, department: string) => {
  return createNotification({
    title: 'New Order Created',
    message: `Order #${orderNumber} has been created and assigned to ${department}`,
    priority: 'high',
    category: 'order',
    orderId,
    department
  });
};

export const notifyOrderStatusChanged = (orderId: string, orderNumber: string, newStatus: string, department: string) => {
  return createNotification({
    title: 'Order Status Updated',
    message: `Order #${orderNumber} status has been changed to ${newStatus}`,
    priority: 'medium',
    category: 'status',
    orderId,
    department
  });
};

export const notifyPaymentReceived = (orderId: string, orderNumber: string, amount: number) => {
  return createNotification({
    title: 'Payment Received',
    message: `Payment of ₹${amount} received for Order #${orderNumber}`,
    priority: 'high',
    category: 'payment',
    orderId
  });
};

export const notifyUserCreated = (userId: string, userName: string, department: string) => {
  return createNotification({
    title: 'New User Added',
    message: `${userName} has been added to ${department} department`,
    priority: 'medium',
    category: 'user',
    userId,
    department
  });
};

export const notifySystemAlert = (message: string, priority: NotificationPriority = 'high') => {
  return createNotification({
    title: 'System Alert',
    message,
    priority,
    category: 'system'
  });
}; 