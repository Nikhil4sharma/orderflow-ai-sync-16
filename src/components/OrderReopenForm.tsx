
import React from 'react';
import { Order } from '@/types';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

interface OrderReopenFormProps {
  order: Order;
  onReopen?: () => void;
}

const OrderReopenForm: React.FC<OrderReopenFormProps> = ({ order, onReopen }) => {
  const handleReopen = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} reopened`);
      if (onReopen) onReopen();
    } catch (error) {
      console.error('Reopen error:', error);
      toast.error('Failed to reopen order');
    }
  };

  return (
    <Button onClick={handleReopen} variant="outline" className="flex items-center gap-2">
      <RefreshCw className="h-4 w-4" />
      Reopen Order
    </Button>
  );
};

export default OrderReopenForm;
