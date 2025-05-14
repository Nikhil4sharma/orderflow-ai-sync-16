
import { OrderStatus, Department } from "@/types";
import { toast } from "sonner";

// Function to notify about order status changes
export const notifyOrderStatusChanged = async (
  orderId: string,
  orderNumber: string,
  newStatus: OrderStatus,
  department: Department
): Promise<void> => {
  try {
    // In a real app, this would send notifications to users via Firebase
    // For now, we'll just show a toast notification
    
    let message = `Order ${orderNumber} status changed to ${newStatus}`;
    let title = "Order Status Updated";
    
    // Customize message based on status
    switch(newStatus) {
      case "Pending Design":
        message = `Order ${orderNumber} has been assigned to Design team`;
        title = "New Design Task";
        break;
      case "Pending Approval":
      case "Approval Requested":
        message = `Order ${orderNumber} needs approval from Sales team`;
        title = "Approval Request";
        break;
      case "Design Approved":
        message = `Design for order ${orderNumber} has been approved`;
        title = "Design Approved";
        break;
      case "Design Rejected":
        message = `Design for order ${orderNumber} has been rejected`;
        title = "Design Rejected";
        break;
      case "Prepress Approved":
        message = `Prepress for order ${orderNumber} has been approved`;
        title = "Prepress Approved";
        break;
      case "Prepress Rejected":
        message = `Prepress for order ${orderNumber} has been rejected`;
        title = "Prepress Rejected";
        break;
      case "Pending Prepress":
        message = `Order ${orderNumber} has been assigned to Prepress team`;
        title = "New Prepress Task";
        break;
      case "Forwarded to Production":
        message = `Order ${orderNumber} has been forwarded to Production`;
        title = "New Production Task";
        break;
      case "Completed":
        message = `Order ${orderNumber} has been completed`;
        title = "Order Completed";
        break;
    }
    
    // Show toast notification
    toast(title, {
      description: message,
      duration: 5000
    });
    
    // In a real app, we would also:
    // 1. Save the notification in Firestore
    // 2. Use Firebase Cloud Messaging to send push notifications
    // 3. Update notification counters
    
    console.log(`Notification: ${title} - ${message}`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error sending notification:", error);
    return Promise.reject(error);
  }
};

// Function to get notification count by department
export const getNotificationCount = async (department: Department): Promise<number> => {
  // In a real app, this would query Firestore for unread notifications
  // For demo purposes, we'll return a random number
  return Math.floor(Math.random() * 5);
};

// Function to mark notifications as read
export const markNotificationsAsRead = async (department: Department): Promise<void> => {
  // In a real app, this would update Firestore
  console.log(`Marking notifications as read for ${department}`);
  return Promise.resolve();
};
