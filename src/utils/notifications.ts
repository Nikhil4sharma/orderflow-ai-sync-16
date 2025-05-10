
import { Department } from "@/types/common";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const notifyOrderStatusChanged = async (
  orderId: string,
  orderNumber: string,
  newStatus: string,
  department: Department | string
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
