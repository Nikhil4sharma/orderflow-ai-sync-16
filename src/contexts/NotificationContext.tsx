import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification, NotificationType, Department, User, Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  notifyOrderCreated: (order: Order) => Promise<void>;
  notifyStatusUpdate: (order: Order, status: string, remarks: string) => Promise<void>;
  notifyPayment: (order: Order, amount: number, paymentStatus: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000;

    const setupNotificationListener = () => {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', 'in', [currentUser.uid, 'all']),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Notification[];
          setNotifications(notificationsData);
          setUnreadCount(notificationsData.filter(n => !n.isRead).length);
          retryCount = 0;
        },
        (error) => {
          console.error("Error in notification sync:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(setupNotificationListener, retryDelay);
          }
        }
      );

      return unsubscribe;
    };

    const unsubscribe = setupNotificationListener();
    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    try {
      const batch = writeBatch(db);
      const notificationRef = doc(db, 'notifications', notificationId);
      batch.update(notificationRef, { isRead: true });
      await batch.commit();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.update(notificationRef, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      const notificationData = {
        ...notification,
        createdAt: Timestamp.now(),
        isRead: false
      };
      await addDoc(collection(db, 'notifications'), notificationData);
    } catch (error) {
      console.error('Error adding notification:', error);
      toast.error('Failed to add notification');
    }
  };

  const notifyOrderCreated = async (order: Order) => {
    await addNotification({
      title: "New Order Created",
      message: `Order #${order.orderNumber} created for ${order.clientName}`,
      type: "order_created",
      orderId: order.id,
      forDepartments: [order.currentDepartment, "Admin", "Sales"],
      forRoles: ["Admin", "Manager", "User"],
      priority: "high",
      category: "order"
    });
  };

  const notifyStatusUpdate = async (order: Order, status: string, remarks: string) => {
    await addNotification({
      title: "Order Status Updated",
      message: `Order #${order.orderNumber} status updated to \"${status}\". Remarks: ${remarks}`,
      type: "order_status_update",
      orderId: order.id,
      forDepartments: [order.currentDepartment, "Admin", "Sales"],
      forRoles: ["Admin", "Manager", "User"],
      priority: "medium",
      category: "order"
    });
  };

  const notifyPayment = async (order: Order, amount: number, paymentStatus: string) => {
    await addNotification({
      title: "Payment Received",
      message: `₹${amount} received for Order #${order.orderNumber} (${paymentStatus})`,
      type: "payment_received",
      orderId: order.id,
      forDepartments: ["Sales", "Admin"],
      forRoles: ["Admin", "Manager", "User"],
      priority: "medium",
      category: "payment"
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      notifyOrderCreated,
      notifyStatusUpdate,
      notifyPayment
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 