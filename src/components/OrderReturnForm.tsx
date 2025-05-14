
import React from 'react';
import { Order } from '@/types';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { CornerDownLeft } from 'lucide-react';

interface OrderReturnFormProps {
  order: Order;
  onReturn?: () => void;
}

const OrderReturnForm: React.FC<OrderReturnFormProps> = ({ order, onReturn }) => {
  const handleReturn = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} returned`);
      if (onReturn) onReturn();
    } catch (error) {
      console.error('Return error:', error);
      toast.error('Failed to return order');
    }
  };

  return (
    <Button onClick={handleReturn} variant="outline" className="flex items-center gap-2">
      <CornerDownLeft className="h-4 w-4" />
      Return Order
    </Button>
  );
};

export default OrderReturnForm;
