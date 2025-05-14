
export type Department = 
  | 'Sales' 
  | 'Design' 
  | 'Prepress' 
  | 'Production' 
  | 'Dispatch' 
  | 'Admin';

export type Role = 'User' | 'Admin' | 'Manager' | 'Staff';

export type OrderStatus = 
  | 'New Order'
  | 'Design'
  | 'Prepress'
  | 'Production'
  | 'Quality Check'
  | 'Ready to Dispatch'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'
  | 'On Hold'
  | 'Completed'
  | 'Verified'
  | 'Design Approved'
  | 'Prepress Approved'
  | 'Approved'
  | 'Payment Verified'
  | 'Payment Recorded: Paid'
  | 'Paid'
  | 'In Progress'
  | 'New'
  | 'Pending Approval'
  | 'Pending Payment'
  | 'Payment Recorded: Partial'
  | 'Issue';

export type StatusType = 'success' | 'info' | 'warning' | 'error';

export type ProductStatus = 'Pending' | 'In Production' | 'Completed';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Refunded' | 'Not Paid' | 'Partially Paid';

export type CourierPartner = 'Blue Dart' | 'Delhivery' | 'DTDC' | 'Ekart' | 'Xpressbees' | 'Others' | 'Shree Maruti' | 'FedEx' | 'DHL' | 'BlueDart' | 'Other';

export type DeliveryType = 'Normal' | 'Express';

export type NotificationType = 
  | 'Order' 
  | 'Payment' 
  | 'Delivery' 
  | 'System'
  | 'status_update'
  | 'approval_request'
  | 'feedback_request'
  | 'ready_for_dispatch'
  | 'order_completed'
  | 'order_issue'
  | 'payment_received'
  | 'payment_required'
  | 'order_created'
  | 'order_status_update';

export interface GoogleSheetConfig {
  spreadsheetId: string;
  sheetName: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiKey: string;
}

export type PermissionKey = 
  | 'orders.view'
  | 'orders.create'
  | 'orders.edit'
  | 'orders.delete'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'departments.view'
  | 'departments.create'
  | 'departments.edit'
  | 'departments.delete'
  | 'settings.view'
  | 'settings.edit'
  | 'view_orders' 
  | 'create_orders' 
  | 'update_orders'
  | 'delete_orders'
  | 'view_users'
  | 'manage_users'
  | 'manage_departments'
  | 'update_order_status'
  | 'verify_orders'
  | 'dispatch_orders'
  | 'view_reports'
  | 'export_data'
  | 'view_analytics'
  | 'manage_settings'
  | 'view_address_details'
  | 'request_approval'
  | 'provide_approval'
  | 'forward_to_department'
  | 'mark_ready_dispatch'
  | 'verify_payment'
  | 'view_delivery_details';

export interface OrderFilters {
  status?: string[];
  department?: string[];
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  searchTerm?: string;
  paymentStatus?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  permissions: PermissionKey[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  orderDate?: string;
  deliveryDate?: string;
  amount: number;
  discount?: number;
  tax?: number;
  shippingCost?: number;
  paymentMethod?: string;
  items: string[] | OrderItem[];
  totalAmount?: number;
  paidAmount: number;
  pendingAmount: number;
  productStatus?: ProductStatus[];
  paymentHistory?: PaymentRecord[];
  createdAt: string;
  lastUpdated: string;
  status: OrderStatus;
  currentDepartment: Department;
  productionStages?: ProductionStageStatus[];
  designStatus?: DesignStatus;
  designTimeline?: string;
  designRemarks?: string;
  prepressStatus?: PrepressStatus;
  prepressRemarks?: string;
  statusHistory: StatusUpdate[];
  paymentStatus: PaymentStatus;
  lastPaymentDate?: string;
  // Fields for dispatch
  dispatchDetails?: DispatchDetails;
  // Fields for Google Sheet integration
  sheetSyncId?: string;
  lastSyncedAt?: string;
  // Fields for approval
  pendingApprovalFrom?: Department;
  approvalReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  // Fields for address information
  deliveryAddress?: string;
  contactNumber?: string;
  // Expected completion date
  expectedCompletionDate?: string;
  // For department field compatibility
  department?: Department;
  // Used in filters
  orderName?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ProductionStageStatus {
  stage: string;
  status: ProductStatus;
  responsible: string;
  startTime: string;
  endTime: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  remarks?: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface StatusUpdate {
  id: string;
  orderId: string;
  department: Department;
  status: OrderStatus;
  remarks?: string;
  timestamp: string;
  updatedBy: string;
  estimatedTime?: string;
  selectedProduct?: string;
  editableUntil?: string;
  metadata?: {
    updatedAt: string;
    updatedBy: string;
    department: string;
    role: string;
  };
}

export interface DispatchDetails {
  address?: string;
  contactNumber?: string;
  courierPartner?: CourierPartner;
  deliveryType?: DeliveryType;
  trackingNumber?: string;
  dispatchDate?: string;
  verifiedBy?: string;
  dispatchedBy?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}
