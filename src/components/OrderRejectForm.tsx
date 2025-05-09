import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after rejecting order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Rejected', order.department); 