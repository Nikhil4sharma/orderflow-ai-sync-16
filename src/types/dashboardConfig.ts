
import { Department } from './common';

// Define all possible dashboard elements that can be toggled
export type DashboardElement = 
  | 'financialSummary'
  | 'orderApprovals'
  | 'recentOrders'
  | 'statusSummary'
  | 'taskList'
  | 'salesMetrics'
  | 'productionTimeline'
  | 'deliverySchedule'
  | 'designTasks'
  | 'prepressQueue'
  | 'productionQueue'
  | 'approvalRequests'
  | 'paymentOverview';

// Configuration for each department
export interface DepartmentDashboardConfig {
  department: Department;
  visibleElements: DashboardElement[];
}

// Main configuration structure
export interface DashboardConfiguration {
  departmentConfigs: Record<Department, DepartmentDashboardConfig>;
  lastUpdated?: string;
  updatedBy?: string;
}

// Default configuration with all elements visible
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfiguration = {
  departmentConfigs: {
    Sales: {
      department: 'Sales',
      visibleElements: [
        'financialSummary',
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'salesMetrics',
        'deliverySchedule',
        'paymentOverview',
        'approvalRequests'
      ]
    },
    Design: {
      department: 'Design',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'taskList',
        'designTasks'
      ]
    },
    Prepress: {
      department: 'Prepress',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'taskList',
        'prepressQueue',
        'approvalRequests'
      ]
    },
    Production: {
      department: 'Production',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'productionTimeline',
        'taskList',
        'productionQueue'
      ]
    },
    Admin: {
      department: 'Admin',
      visibleElements: [
        'financialSummary',
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'taskList',
        'salesMetrics',
        'productionTimeline',
        'deliverySchedule',
        'paymentOverview',
        'approvalRequests'
      ]
    }
  }
};
