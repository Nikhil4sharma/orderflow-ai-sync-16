
export type Department = 'Sales' | 'Production' | 'Design' | 'Prepress' | 'Admin';

export type Role = 'Admin' | 'Manager' | 'Staff' | string;

export type OrderStatus = 
  | 'In Progress'
  | 'Completed'
  | 'On Hold'
  | 'Issue'
  | 'Verified'
  | 'Dispatched'
  | 'Ready to Dispatch'
  | 'New'
  | 'Pending Approval'
  | 'Pending Payment';

export type StatusType = 'completed' | 'processing' | 'issue';

export type PaymentStatus = 'Not Paid' | 'Partial' | 'Paid' | 'Partially Paid';

export type CourierPartner = 'Shree Maruti' | 'DTDC' | 'FedEx' | 'DHL' | 'BlueDart' | 'Other';

export type DeliveryType = 'Normal' | 'Express';

export type NotificationType = 
  | 'status_update'
  | 'approval_request'
  | 'feedback_request'
  | 'ready_for_dispatch'
  | 'order_completed'
  | 'order_issue'
  | 'payment_received'
  | 'payment_required';

export type GoogleSheetConfig = {
  sheetId: string;
  tabName: string;
  apiKey?: string;
};

// Permission system
export type PermissionKey = 
  | "view_orders" 
  | "create_orders" 
  | "update_orders"
  | "delete_orders"
  | "view_users"
  | "manage_users"
  | "manage_departments"
  | "update_order_status"
  | "verify_orders"
  | "dispatch_orders"
  | "view_reports"
  | "export_data"
  | "view_analytics"
  | "manage_settings"
  | "view_address_details"
  | "request_approval"
  | "provide_approval"
  | "forward_to_department"
  | "mark_ready_dispatch"
  | "verify_payment"
  | "view_delivery_details";
