import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after holding order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'On Hold', order.department); 