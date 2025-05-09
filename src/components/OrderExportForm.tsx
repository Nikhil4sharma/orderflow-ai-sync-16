import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after exporting order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Exported', order.department); 