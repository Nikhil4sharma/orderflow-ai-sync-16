
import React from 'react';
import { Order } from '@/types';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface OrderImportFormProps {
  order: Order;
  onImport?: () => void;
}

const OrderImportForm: React.FC<OrderImportFormProps> = ({ order, onImport }) => {
  const handleImport = async () => {
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress', order.currentDepartment);
      toast.success(`Order #${order.orderNumber} imported successfully`);
      if (onImport) onImport();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import order');
    }
  };

  return (
    <Button onClick={handleImport} variant="outline" className="flex items-center gap-2">
      <Upload className="h-4 w-4" />
      Import Order
    </Button>
  );
};

export default OrderImportForm;
