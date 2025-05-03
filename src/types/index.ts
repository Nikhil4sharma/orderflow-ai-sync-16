
export type Department = 'Sales' | 'Production' | 'Design' | 'Prepress';

export type ProductionStage = 'Printing' | 'Foiling' | 'Electroplating' | 'Cutting' | 'Pasting';

export type DesignStatus = 'Working on it' | 'Pending Feedback' | 'Completed';

export type OrderStatus = 'New' | 'In Progress' | 'Completed' | 'On Hold' | 'Issue';

export type StatusType = 'completed' | 'processing' | 'issue';

export type PaymentStatus = 'Not Paid' | 'Partially Paid' | 'Paid';

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
  editableUntil?: string; // Time until which this update can be edited
  selectedProduct?: string; // ID of the product this update is for
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
  prepressStatus?: 'Pending' | 'Reviewing' | 'Ready';
  prepressRemarks?: string;
  statusHistory: StatusUpdate[];
  paymentStatus: PaymentStatus;
  lastPaymentDate?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  department: Department;
  role: string;
}
