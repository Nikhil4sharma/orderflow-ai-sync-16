
import React from 'react';
import { Order, OrderStatus } from '@/types';
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
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Issue' as OrderStatus, order.currentDepartment);
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
