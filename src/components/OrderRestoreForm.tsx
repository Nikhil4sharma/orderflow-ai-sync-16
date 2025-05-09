import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after restoring order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Restored', order.department); 