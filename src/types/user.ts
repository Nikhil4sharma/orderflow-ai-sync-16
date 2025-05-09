
import { Department, Role } from './common';

export type PermissionKey = 
  | 'manage_users'
  | 'manage_departments'
  | 'manage_orders'
  | 'update_orders'
  | 'delete_orders'
  | 'view_finances'
  | 'manage_settings'
  | 'export_data'
  | 'create_orders' 
  | 'update_order_status'
  | 'verify_orders'
  | 'dispatch_orders'
  | 'view_reports'
  | 'view_analytics'
  | 'view_address_details'
  | 'request_approval'
  | 'provide_approval'
  | 'forward_to_department'
  | 'mark_ready_dispatch'
  | 'verify_payment'
  | 'view_delivery_details';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  department: Department;
  role: Role;
  permissions?: PermissionKey[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: string;
  orderId?: string;
  forDepartments: Department[];
  forRoles?: Role[];
}
