import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after archiving order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Archived', order.department); 