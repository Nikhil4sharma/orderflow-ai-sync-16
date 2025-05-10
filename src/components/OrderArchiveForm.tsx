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
import { Archive } from "lucide-react";
import { toast } from "sonner";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderArchiveFormProps {
  orderId: string;
}

const OrderArchiveForm: React.FC<OrderArchiveFormProps> = ({ orderId }) => {
  const { getOrder, updateOrder } = useOrders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const order = getOrder(orderId);

  if (!order) {
    return <p>Order not found</p>;
  }

  const handleSubmit = async (order) => {
    setIsLoading(true);
    try {
      const updatedOrder = { ...order, status: "Completed" };
      await updateOrder(updatedOrder);
      toast.success("Order archived successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error archiving order:", error);
      toast.error("Failed to archive order");
    } finally {
      setIsLoading(false);
    }
    
    // Notify about status change
    await notifyOrderStatusChanged(order.id, order.orderNumber, 'Archived', order.currentDepartment);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={isLoading}
      >
        <Archive className="mr-2 h-4 w-4" />
        Archive Order
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Archive Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={() => handleSubmit(order)}
            >
              {isLoading ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderArchiveForm;
