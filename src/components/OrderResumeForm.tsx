
import React from 'react';
import { Order } from '@/types/common';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

interface OrderResumeFormProps {
  order: Order;
  onResume?: () => void;
}

const OrderResumeForm: React.FC<OrderResumeFormProps> = ({ order, onResume }) => {
  const handleResume = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} resumed`);
      if (onResume) onResume();
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('Failed to resume order');
    }
  };

  return (
    <Button onClick={handleResume} variant="outline" className="flex items-center gap-2">
      <Play className="h-4 w-4" />
      Resume Order
    </Button>
  );
};

export default OrderResumeForm;
