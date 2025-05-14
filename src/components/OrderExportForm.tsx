
import React from 'react';
import { Order, OrderStatus } from '@/types';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

interface OrderExportFormProps {
  order: Order;
  onExport?: () => void;
}

const OrderExportForm: React.FC<OrderExportFormProps> = ({ order, onExport }) => {
  const handleExport = async () => {
    try {
      // Add export functionality here
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress' as OrderStatus, order.currentDepartment);
      toast.success(`Order #${order.orderNumber} exported successfully`);
      if (onExport) onExport();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export order');
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Export Order
    </Button>
  );
};

export default OrderExportForm;
