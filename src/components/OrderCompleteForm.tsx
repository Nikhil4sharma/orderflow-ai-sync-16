import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Order } from "@/types";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderCompleteFormProps {
  order: Order;
  onComplete?: () => void;
}

export const handleSubmit = async (order) => {
  if (!order) {
    toast.error("Order is missing, cannot complete.");
    return;
  }
  
  // Mark order as completed
  order.status = "Completed";
  
  // Update the order
  // await updateOrder(order);
  
  // Notify about status change
  await notifyOrderStatusChanged(order.id, order.orderNumber, 'Completed', order.currentDepartment);
};

const OrderCompleteForm: React.FC<OrderCompleteFormProps> = ({ order, onComplete }) => {
  const { updateOrder } = useOrders();
  
  const handleComplete = async () => {
    if (!order) {
      toast.error("Order is missing, cannot complete.");
      return;
    }
    
    try {
      // Mark order as completed
      const updatedOrder = {
        ...order,
        status: "Completed",
      };
      
      // Update the order
      await updateOrder(updatedOrder);
      
      // Notify about status change
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Completed', order.currentDepartment);
      
      toast.success("Order marked as completed!");
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to complete order");
    }
  };
  
  return (
    <Button 
      onClick={handleComplete} 
      className="w-full"
    >
      <CheckCircle className="h-4 w-4 mr-2" />
      Mark as Complete
    </Button>
  );
};

export default OrderCompleteForm;
