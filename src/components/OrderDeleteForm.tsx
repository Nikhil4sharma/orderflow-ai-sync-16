
import { notifyOrderStatusChanged } from '@/utils/notifications';
import React from 'react';
import { Department, OrderStatus } from '@/types/common';
import { Button } from '@/components/ui/button'; 
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  currentDepartment: Department;
}

interface OrderDeleteFormProps {
  order: Order;
  onDelete?: () => void;
}

const OrderDeleteForm: React.FC<OrderDeleteFormProps> = ({ order, onDelete }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Deleted' as OrderStatus, order.currentDepartment);
      if (onDelete) onDelete();
      toast.success(`Order #${order.orderNumber} deleted successfully`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <p className="mb-4 text-red-600">Are you sure you want to delete order #{order.orderNumber}?</p>
      <Button type="submit" variant="destructive" className="w-full flex items-center justify-center gap-2">
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </form>
  );
};

export default OrderDeleteForm;
