import { notifyOrderStatusChanged } from '@/utils/notifications';
import React from 'react';

interface Order {
  id: string;
  orderNumber: string;
  department: string;
}

interface OrderDeleteFormProps {
  order: Order;
  onDelete?: () => void;
}

const OrderDeleteForm: React.FC<OrderDeleteFormProps> = ({ order, onDelete }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Deleted', order.department);
      if (onDelete) onDelete();
    } catch (error) {
      // Error handle karo, toast ya console
      console.error('Delete error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Are you sure you want to delete order #{order.orderNumber}?</p>
      <button type="submit">Delete</button>
    </form>
  );
};

export default OrderDeleteForm; 