export type Department = 
  | 'Sales' 
  | 'Design' 
  | 'Prepress' 
  | 'Production' 
  | 'Dispatch' 
  | 'Admin';

export type Role = 'User' | 'Admin';

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
  | 'On Hold';

export type StatusType = 'success' | 'info' | 'warning' | 'error';

export type ProductStatus = 'Pending' | 'In Production' | 'Completed';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Refunded';

export type CourierPartner = 'Blue Dart' | 'Delhivery' | 'DTDC' | 'Ekart' | 'Xpressbees' | 'Others';

export type DeliveryType = 'Normal' | 'Express';

export type NotificationType = 'Order' | 'Payment' | 'Delivery' | 'System';

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
  | 'settings.edit';

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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  billingAddress: string;
  orderDate: string;
  deliveryDate: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  tax: number;
  shippingCost: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentHistory: PaymentRecord[];
  courierPartner: CourierPartner;
  trackingNumber: string;
  deliveryType: DeliveryType;
  status: OrderStatus;
  currentDepartment: Department;
  productionStageStatus?: ProductionStageStatus[];
  designStatus?: string;
  prepressStatus?: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  createdBy: string;
  updatedBy: string;
  dispatchDetails?: DispatchDetails;
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
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  transactionId: string;
  notes: string;
}

export interface DispatchDetails {
  dispatchedBy: string;
  dispatchDate: string;
  expectedDeliveryDate: string;
  notes: string;
}

export interface StatusUpdate {
  id: string;
  orderId: string;
  timestamp: string;
  department: Department;
  status: OrderStatus;
  remarks: string;
  updatedBy: string;
  editableUntil: string;
  estimatedTime?: string;
  selectedProduct?: string;
}
