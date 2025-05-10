import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderCancelFormProps {
  order: Order;
}

const OrderCancelForm: React.FC<OrderCancelFormProps> = ({ order }) => {
  const { updateOrder } = useOrders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      // Update the order status to "Cancelled"
      const updatedOrder = { ...order, status: "On Hold" as OrderStatus };
      await updateOrder(updatedOrder);

      // Notify about status change
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Cancelled', order.currentDepartment);

      toast.success("Order has been cancelled successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <XCircle className="h-4 w-4" />
        Cancel Order
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderCancelForm;
