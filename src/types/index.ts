
// Export types from common.ts
export type {
  Department,
  Role,
  OrderStatus,
  StatusType,
  PaymentStatus,
  CourierPartner,
  DeliveryType,
  NotificationType,
  GoogleSheetConfig,
  PermissionKey,
  OrderFilters,
  User,
  Order,
  ProductionStageStatus,
  ProductStatus,
  PaymentRecord,
  DispatchDetails,
  StatusUpdate,
} from './common';

// Export types from department.ts (avoiding duplicates)
export type {
  // These are imported from department.ts specifically to avoid conflicts
  // with any similar types from common.ts
} from './department';

// Re-export ProductionStage, DesignStatus and PrepressStatus from department.ts
// instead of common.ts to avoid ambiguity
export { 
  ProductionStage,
  DesignStatus,
  PrepressStatus,
} from './department';
