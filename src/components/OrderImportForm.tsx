import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after importing order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Imported', order.department); 