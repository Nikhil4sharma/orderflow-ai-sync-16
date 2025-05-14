
import { Department, OrderStatus, PaymentStatus, StatusType, CourierPartner, DeliveryType } from './common';
import { ProductionStage, DesignStatus, PrepressStatus } from './department';

export interface ProductStatus {
  id: string;
  name: string;
  status: StatusType;
  remarks?: string;
  estimatedCompletion?: string;
  assignedDepartment?: Department;
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
  estimatedTime?: string;
  selectedProduct?: string;
  editableUntil?: string; // Making this optional
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
}

export type ProductionStageStatus = {
  stage: ProductionStage;
  status: StatusType;
  remarks?: string;
  timeline?: string;
};

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
}
