import { notifyPaymentReceived } from '@/utils/notifications';

// Inside handleSubmit function, after payment creation:
await notifyPaymentReceived(order.id, order.orderNumber, formData.amount); 