
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Order, OrderStatus } from "@/types";
import { notifyOrderStatusChanged } from "@/utils/notifications";

interface OrderStatusFormProps {
  order: Order;
  onComplete?: () => void;
}

const OrderStatusForm: React.FC<OrderStatusFormProps> = ({ order, onComplete }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [remarks, setRemarks] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update the order with new status
      const updatedOrder = {
        ...order,
        status,
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        department: currentUser?.department || 'Unknown',
        status,
        remarks
      });
      
      // Notify about status change
      await notifyOrderStatusChanged(order.id, order.orderNumber, status, order.currentDepartment);
      
      toast.success(`Order status updated to: ${status}`);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  
  const statusOptions: OrderStatus[] = [
    "New",
    "In Progress",
    "On Hold",
    "Completed",
    "Ready to Dispatch",
    "Dispatched",
    "Issue",
    "Verified"
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Order Status
        </label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as OrderStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="remarks" className="text-sm font-medium">
          Remarks
        </label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks about the status change (optional)"
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Update Order Status
      </Button>
    </form>
  );
};

export default OrderStatusForm;
