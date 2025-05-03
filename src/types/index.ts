
export type Department = 'Sales' | 'Production' | 'Design' | 'Prepress';

export type ProductionStage = 'Printing' | 'Foiling' | 'Electroplating' | 'Cutting' | 'Pasting';

export type DesignStatus = 'Working on it' | 'Pending Feedback' | 'Completed';

export type OrderStatus = 'New' | 'In Progress' | 'Completed' | 'On Hold' | 'Issue';

export type StatusType = 'completed' | 'processing' | 'issue';

export interface StatusUpdate {
  id: string;
  orderId: string;
  department: Department;
  status: string;
  remarks?: string;
  timestamp: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  amount: number;
  items: string[];
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
}

export interface User {
  id: string;
  name: string;
  department: Department;
  role: string;
}
