
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
  | 'Pending Approval';

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
