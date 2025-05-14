
import React from 'react';
import { Order, OrderStatus } from '@/types';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Pause } from 'lucide-react';

interface OrderHoldFormProps {
  order: Order;
  onHold?: () => void;
}

const OrderHoldForm: React.FC<OrderHoldFormProps> = ({ order, onHold }) => {
  const handleHold = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'On Hold' as OrderStatus, order.currentDepartment);
      toast.success(`Order #${order.orderNumber} placed on hold`);
      if (onHold) onHold();
    } catch (error) {
      console.error('Hold error:', error);
      toast.error('Failed to place order on hold');
    }
  };

  return (
    <Button onClick={handleHold} variant="outline" className="flex items-center gap-2">
      <Pause className="h-4 w-4" />
      Place on Hold
    </Button>
  );
};

export default OrderHoldForm;
