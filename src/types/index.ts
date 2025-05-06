export type Department = 'Sales' | 'Production' | 'Design' | 'Prepress' | 'Admin';

export type ProductionStage = 'Printing' | 'Cutting' | 'Pasting' | 'Foiling' | 'Electroplating' | 'Letterpress' | 'Embossed' | 'Diecut' | 'Quality Check' | 'Ready to Dispatch';

export type DesignStatus = 'Working on it' | 'Pending Feedback from Sales Team' | 'Forwarded to Prepress';

export type PrepressStatus = 'Waiting for approval' | 'Forwarded to production' | 'Working on it';

export type OrderStatus = 'In Progress' | 'Completed' | 'On Hold' | 'Issue' | 'Verified' | 'Dispatched' | 'Ready to Dispatch' | 'New';

export type StatusType = 'completed' | 'processing' | 'issue';

export type PaymentStatus = 'Not Paid' | 'Partially Paid' | 'Paid' | 'Partial';

export type CourierPartner = 'Shree Maruti' | 'DTDC' | 'FedEx' | 'DHL' | 'BlueDart' | 'Other';

export type DeliveryType = 'Normal' | 'Express';

export type Role = 'Admin' | 'Manager' | 'Staff' | string;

export interface ProductStatus {
  id: string;
  name: string;
  status: StatusType;
  remarks?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  remarks?: string;
}

export interface StatusUpdate {
  id: string;
  orderId: string;
  department: Department;
  status: string;
  remarks?: string;
  timestamp: string;
  updatedBy: string;
  editableUntil?: string; 
  selectedProduct?: string;
  estimatedTime?: string;
}

export interface DispatchDetails {
  address?: string;
  contactNumber?: string;
  courierPartner?: CourierPartner;
  deliveryType?: DeliveryType;
  trackingNumber?: string;
  dispatchDate?: string;
  verifiedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  items: string[];
  productStatus?: ProductStatus[];
  paymentHistory?: PaymentRecord[];
  createdAt: string;
  status: OrderStatus;
  currentDepartment: Department;
  productionStages?: {
    stage: ProductionStage;
    status: StatusType;
    timeline?: string;
    remarks?: string;
  }[];
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
}

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  department: Department;
  role: Role;
  permissions?: PermissionKey[];
}

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

export interface GoogleSheetConfig {
  sheetId: string;
  tabName: string;
  apiKey?: string;
  lastSyncedAt?: string;
}

export interface FilterOptions {
  department: Department | 'All';
  status: OrderStatus | 'All';
  searchTerm: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}
