
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Copy } from "lucide-react";
import { Order } from "@/types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface OrderDuplicateFormProps {
  order: Order;
}

const OrderDuplicateForm: React.FC<OrderDuplicateFormProps> = ({ order }) => {
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDuplicate = async () => {
    setIsSubmitting(true);
    
    try {
      // Create a new order based on the current one
      const newOrderId = nanoid();
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const newOrderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const newOrder: Order = {
        ...order,
        id: newOrderId,
        orderNumber: newOrderNumber,
        createdAt: timestamp,
        lastUpdated: timestamp,
        status: "New",
        statusHistory: [{
          id: nanoid(),
          orderId: newOrderId,
          timestamp,
          department: order.currentDepartment,
          status: "New",
          remarks: `Duplicated from order #${order.orderNumber}`,
          updatedBy: "System",
          editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss')
        }],
        paymentHistory: [],
        paidAmount: 0,
        pendingAmount: order.amount,
        paymentStatus: "Not Paid",
        verifiedBy: undefined,
        verifiedAt: undefined
      };
      
      await addOrder(newOrder);
      toast.success(`Order duplicated successfully as #${newOrderNumber}`);
      
      // Navigate to the new order
      navigate(`/orders/${newOrderId}`);
    } catch (error) {
      console.error("Error duplicating order:", error);
      toast.error("Failed to duplicate order");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Button 
      onClick={handleDuplicate} 
      variant="outline" 
      className="w-full flex items-center gap-2"
      disabled={isSubmitting}
    >
      <Copy className="h-4 w-4" />
      {isSubmitting ? "Duplicating..." : "Duplicate Order"}
    </Button>
  );
};

export default OrderDuplicateForm;
