
import { Department, Role, NotificationType } from './common';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  orderId?: string;
  userId?: string;
  forDepartments: Department[];
  forRoles?: Role[];
  priority: 'high' | 'medium' | 'low';
  category: 'order' | 'status' | 'payment' | 'user' | 'system';
  data?: Record<string, any>;
}
