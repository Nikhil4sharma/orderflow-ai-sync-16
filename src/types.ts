
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: Department;
  role: Role;
  permissions: PermissionKey[];
};

export type Role = "Admin" | "Manager" | "User";

export type Department = "Sales" | "Design" | "Prepress" | "Production";

// Updated order status to match the workflow
export type OrderStatus = 
  | "In Progress"
  | "On Hold"
  | "Completed"
  | "Dispatched"
  | "Issue"
  | "Ready to Dispatch"
  | "Pending Approval"
  | "Pending Payment";

// Design department specific statuses
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

export type PaymentStatus = "Not Paid" | "Partial" | "Paid";

export type CourierPartner = "Shree Maruti" | "DTDC" | "FedEx" | "DHL" | "BlueDart" | "Other";

export type DeliveryType = "Normal" | "Express";

export type StatusType = "processing" | "completed" | "issue";

export type Order = {
  id: string;
  orderNumber: string;
  clientName: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  items: string[];
  createdAt: string;
  status: OrderStatus;
  currentDepartment: Department;
  paymentStatus: PaymentStatus;
  statusHistory: StatusUpdate[];
  sheetSyncId?: string;
  
  // Department specific status fields
  designStatus?: DesignStatus;
  designRemarks?: string;
  designTimeline?: string;
  
  prepressStatus?: PrepressStatus;
  prepressRemarks?: string;
  
  // Production related fields
  productionStages?: ProductionStageStatus[];
  
  // Product status 
  productStatus?: ProductStatus[];
  
  // Payment records
  paymentHistory?: PaymentRecord[];
  
  // Address information
  deliveryAddress?: string;
  contactNumber?: string;
  
  // Dispatch details
  dispatchDetails?: DispatchDetails;
  
  // Approval tracking
  pendingApprovalFrom?: Department;
  approvalReason?: string;
  
  // Timeline tracking
  expectedCompletionDate?: string;
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
  id?: string;
  orderId?: string;
  timestamp?: string;
  department: Department;
  status: string;
  remarks?: string;
  updatedBy?: string;
  editableUntil?: string;
  estimatedTime?: string;
  selectedProduct?: string;
};

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

// Notification type
export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  orderId?: string;
  forDepartments: Department[];
  forRoles?: Role[];
};

export type NotificationType = 
  | "status_update"
  | "approval_request"
  | "feedback_request"
  | "ready_for_dispatch"
  | "order_completed"
  | "order_issue"
  | "payment_received"
  | "payment_required";
