import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after returning order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Returned', order.department); 