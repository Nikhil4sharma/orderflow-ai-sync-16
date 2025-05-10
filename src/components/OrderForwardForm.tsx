
import React from 'react';
import { Order, Department } from '@/types/common';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

interface OrderForwardFormProps {
  order: Order;
  onForward?: () => void;
}

const OrderForwardForm: React.FC<OrderForwardFormProps> = ({ order, onForward }) => {
  const handleForward = async (department: Department) => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, `Forwarded to ${department}`, department);
      toast.success(`Order #${order.orderNumber} forwarded to ${department}`);
      if (onForward) onForward();
    } catch (error) {
      console.error('Forward error:', error);
      toast.error('Failed to forward order');
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Forward to Department</h3>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => handleForward('Design')} variant="outline">
          <ArrowRight className="h-3 w-3 mr-1" />
          Design
        </Button>
        <Button size="sm" onClick={() => handleForward('Prepress')} variant="outline">
          <ArrowRight className="h-3 w-3 mr-1" />
          Prepress
        </Button>
        <Button size="sm" onClick={() => handleForward('Production')} variant="outline">
          <ArrowRight className="h-3 w-3 mr-1" />
          Production
        </Button>
        <Button size="sm" onClick={() => handleForward('Sales')} variant="outline">
          <ArrowRight className="h-3 w-3 mr-1" />
          Sales
        </Button>
      </div>
    </div>
  );
};

export default OrderForwardForm;
