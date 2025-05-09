import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after resuming order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'In Progress', order.department); 