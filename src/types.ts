
// User types
export type UserRole = "Admin" | "Sales" | "Design" | "Production" | "Prepress" | "Member";
export type Department = "Sales" | "Design" | "Production" | "Prepress";

export interface User {
  id: string;
  name: string;
  department: Department;
  role: UserRole;
  email?: string;
  password?: string; // Added password field to fix build errors
}

// Order status types
export type OrderStatus = "New" | "In Progress" | "Completed" | "On Hold" | "Issue" | "Verified" | "Dispatched" | "Ready to Dispatch";
export type PaymentStatus = "Not Paid" | "Partially Paid" | "Paid";
export type StatusType = "processing" | "completed" | "issue";

// Production stage type
export type ProductionStage = "Material Preparation" | "Machine Setup" | "Printing" | "Finishing" | "Quality Check" | "Packing";

// Status update interface
export interface StatusUpdate {
  id: string;
  orderId: string;
  timestamp: string;
  department: string;
  status: string;
  remarks?: string;
  updatedBy: string;
  estimatedTime?: string;
  editableUntil?: string;
  editedAt?: string;
  selectedProduct?: string;
}

// Product status interface
export interface ProductStatus {
  id: string;
  name: string;
  status: StatusType;
  remarks?: string;
  estimatedCompletion?: string; // Added for timeline estimation
  assignedDepartment?: Department; // Track which department is responsible
}

// Production stage details
export interface ProductionStageDetails {
  stage: ProductionStage;
  status: StatusType;
  remarks?: string;
  timeline?: string;
}

// Courier partner types
export type CourierPartner = "Shree Maruti" | "DTDC" | "FedEx" | "DHL" | "BlueDart" | "Other";
export type DeliveryType = "Normal" | "Express";

// Dispatch details
export interface DispatchDetails {
  address: string;
  contactNumber: string;
  courierPartner: CourierPartner;
  deliveryType: DeliveryType;
  trackingNumber?: string;
  dispatchDate: string;
  verifiedBy: string;
}

// Payment record
export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  remarks?: string;
}

// Google Sheet configuration
export interface GoogleSheetConfig {
  sheetId: string;
  tabName: string;
  apiKey?: string;
}

// Filter options
export interface FilterOptions {
  department: Department | 'All';
  status: string | 'All';
  searchQuery?: string;
  dateRange: { start: Date; end: Date } | null;
  searchTerm?: string;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  createdAt: string;
  status: OrderStatus;
  currentDepartment: Department;
  items: string[];
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  paymentHistory?: PaymentRecord[];
  designStatus?: string;
  designRemarks?: string;
  designTimeline?: string;
  prepressStatus?: string;
  prepressRemarks?: string;
  productionStages?: ProductionStageDetails[];
  productStatus?: ProductStatus[];
  dispatchDetails?: DispatchDetails;
  statusHistory: StatusUpdate[];
  sheetSyncId?: string;
  lastPaymentDate?: string;
  // Added fields for contact and address info
  contactNumber?: string;
  deliveryAddress?: string;
}

// Permission interfaces
export interface Permission {
  name: string;
  description: string;
  key: PermissionKey;
}

export type PermissionKey = 
  | "view_financial_data" 
  | "dispatch_orders" 
  | "verify_orders"
  | "update_order_status"
  | "view_full_timeline"
  | "view_address_details"
  | "edit_orders"
  | "admin_dashboard"
  | "manage_users"
  | "update_product_status"; // New permission for updating product-level status
