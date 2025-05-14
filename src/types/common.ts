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
  | 'Pending Payment'
  | 'Design Approved'
  | 'Prepress Approved'
  | 'Design Rejected'
  | 'Prepress Rejected'
  | 'Approved'
  | 'Rejected'
  | 'Payment Verified'
  | 'Partial Payment Received'
  | 'Payment Recorded: Not Paid'
  | 'Payment Recorded: Partial'
  | 'Payment Recorded: Paid'
  | 'Forwarded to Prepress'
  | 'Forwarded to Sales'
  | 'Forwarded to Design'
  | 'Forwarded to Production'
  | 'Forwarded to Admin'
  | 'Approval Requested'
  | 'Product Status: processing'
  | 'Product Status: completed'
  | 'Product Status: issue'
  | 'Exported'
  | 'Imported'
  | 'Returned'
  | 'Reopened'
  | 'Restored'
  | 'Deleted'
  | 'Archived'
  | 'Cancelled'
  | 'Pending Design';

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

// Add OrderFilters type
export type OrderFilters = {
  department?: Department;
  status?: OrderStatus;
  paymentStatus?: string;
  dateRange?: any;
  amountRange?: {
    min?: number;
    max?: number;
  };
  searchTerm?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: Department;
  role: Role;
  permissions: PermissionKey[];
};

export type Order = {
  id: string;
  orderNumber: string;
  clientName: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  items: string[];
  createdAt: string;
  lastUpdated: string;
  status: OrderStatus;
  currentDepartment: Department;
  paymentStatus: PaymentStatus;
  statusHistory: StatusUpdate[];
  paymentHistory: PaymentRecord[];
  timeline?: {
    [key: string]: {
      timestamp: string;
      remarks: string;
      updatedBy: string;
    };
  };
  sheetSyncId?: string;
  pendingApprovalFrom?: Department;
  approvalReason?: string;
  productStatus?: ProductStatus[];
  
  // Department specific status fields
  designStatus?: DesignStatus;
  designRemarks?: string;
  designTimeline?: string;
  
  prepressStatus?: PrepressStatus;
  prepressRemarks?: string;
  
  // Production related fields
  productionStages?: ProductionStageStatus[];
  
  // Address information
  deliveryAddress?: string;
  contactNumber?: string;
  
  // Dispatch details
  dispatchDetails?: DispatchDetails;
  
  // Timeline tracking
  expectedCompletionDate?: string;
  
  // Verification details
  verifiedBy?: string;
  verifiedAt?: string;
  
  // Backwards compatibility
  department?: Department;
};

export type ProductionStageStatus = {
  stage: ProductionStage;
  status: StatusType;
  remarks?: string;
  timeline?: string;
};

export type ProductStatus = {
  id: string;
  name: string;
  status: StatusType;
  remarks?: string;
  estimatedCompletion?: string;
  assignedDepartment?: Department;
};

export type PaymentRecord = {
  id: string;
  amount: number;
  date: string;
  method: string;
  remarks?: string;
};

export type DispatchDetails = {
  address: string;
  contactNumber: string;
  courierPartner: CourierPartner;
  deliveryType: DeliveryType;
  trackingNumber?: string;
  dispatchDate: string;
  verifiedBy: string;
};

export type StatusUpdate = {
  id: string;
  orderId: string;
  timestamp: string;
  department: Department;
  status: OrderStatus;
  remarks: string;
  updatedBy: string;
  estimatedTime?: string;
  selectedProduct?: string;
  editableUntil: string;
  metadata?: {
    updatedAt: string;
    updatedBy: string;
    department: Department;
    role: Role;
  };
};

export type DesignStatus = 
  | "Working on it" 
  | "Pending Feedback from Sales Team" 
  | "Forwarded to Prepress";

// Prepress department specific statuses
export type PrepressStatus = 
  | "Waiting for approval" 
  | "Working on it" 
  | "Forwarded to production";

// Production specific status
export type ProductionStatus = 
  | "In Progress"
  | "On Hold"
  | "Ready to Dispatch"
  | "Completed"
  | "Issue";

export type ProductionStage = 
  | "Printing" 
  | "Pasting" 
  | "Cutting" 
  | "Foiling"
  | "Letterpress" 
  | "Embossed" 
  | "Diecut" 
  | "Quality Check"
  | "Ready to Dispatch";
