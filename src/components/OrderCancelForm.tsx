import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after cancelling order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Cancelled', order.department); 