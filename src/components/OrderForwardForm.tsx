import { notifyOrderStatusChanged } from '@/utils/notifications';

// Inside handleSubmit function, after forwarding order:
await notifyOrderStatusChanged(order.id, order.orderNumber, 'Forwarded', formData.department); 