
import { Department, OrderStatus } from "@/types";
import { toast } from "sonner";

/**
 * Notify about order status changes
 * @param orderId The order ID
 * @param orderNumber The order number (human-readable)
 * @param newStatus New status
 * @param department Department that changed the status
 */
export const notifyOrderStatusChanged = async (
  orderId: string,
  orderNumber: string,
  newStatus: OrderStatus | string,
  department: Department
): Promise<void> => {
  // In a real application, this would handle sending notifications to the database,
  // email notifications, push notifications, etc.
  
  console.log(`Order ${orderNumber} status changed to ${newStatus} by ${department}`);
  
  // For now, just show a toast
  toast.info(`Order #${orderNumber} is now ${newStatus}`, {
    description: `Updated by ${department} department`,
    duration: 3000,
  });
  
  return Promise.resolve();
};
