
import React from 'react';
import { Order } from '@/types/common';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';

interface OrderRestoreFormProps {
  order: Order;
  onRestore?: () => void;
}

const OrderRestoreForm: React.FC<OrderRestoreFormProps> = ({ order, onRestore }) => {
  const handleRestore = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Restored', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} restored`);
      if (onRestore) onRestore();
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Failed to restore order');
    }
  };

  return (
    <Button onClick={handleRestore} variant="outline" className="flex items-center gap-2">
      <RotateCcw className="h-4 w-4" />
      Restore Order
    </Button>
  );
};

export default OrderRestoreForm;
