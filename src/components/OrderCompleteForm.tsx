
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types/common";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderCompleteFormProps {
  order: Order;
  onComplete?: () => void;
}

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
        status: "Completed" as OrderStatus,
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
