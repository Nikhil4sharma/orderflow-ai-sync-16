
import React from 'react';
import { Order } from '@/types/common';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

interface OrderRejectFormProps {
  order: Order;
  onReject?: () => void;
}

const OrderRejectForm: React.FC<OrderRejectFormProps> = ({ order, onReject }) => {
  const handleReject = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Rejected', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} rejected`);
      if (onReject) onReject();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject order');
    }
  };

  return (
    <Button onClick={handleReject} variant="destructive" className="flex items-center gap-2">
      <XCircle className="h-4 w-4" />
      Reject Order
    </Button>
  );
};

export default OrderRejectForm;
