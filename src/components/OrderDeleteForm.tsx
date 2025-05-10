
import { notifyOrderStatusChanged } from '@/utils/notifications';
import React from 'react';
import { Department } from '@/types/common';

interface Order {
  id: string;
  orderNumber: string;
  currentDepartment: Department;
}

interface OrderDeleteFormProps {
  order: Order;
  onDelete?: () => void;
}

const OrderDeleteForm: React.FC<OrderDeleteFormProps> = ({ order, onDelete }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Deleted', order.currentDepartment);
      if (onDelete) onDelete();
    } catch (error) {
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
