import { parseISO } from 'date-fns';

interface Order {
  createdAt: string;
  dueDate: string;
}

const OrdersTable = ({ order }: { order: Order }) => {
  const date = typeof order.createdAt === 'string' ? parseISO(order.createdAt) : null;
  const dueDate = typeof order.dueDate === 'string' ? parseISO(order.dueDate) : null;
  // ... existing code ...
}; 