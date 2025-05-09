import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after reopening order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Reopened', order.department); 