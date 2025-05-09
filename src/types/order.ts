
import { Department, OrderStatus, PaymentStatus, StatusType, CourierPartner, DeliveryType } from './common';
import { ProductionStage, DesignStatus, PrepressStatus } from './department';

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
  // Fields for approval
  pendingApprovalFrom?: Department;
  approvalReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}
