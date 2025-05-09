import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after completing order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Completed', order.department); 