
import { Department } from './index';

// Define all possible dashboard elements that can be toggled
export type DashboardElement = 
  | 'financialSummary'
  | 'orderApprovals'
  | 'recentOrders'
  | 'statusSummary'
  | 'taskList'
  | 'salesMetrics'
  | 'productionTimeline'
  | 'deliverySchedule';

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
        'deliverySchedule'
      ]
    },
    Design: {
      department: 'Design',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'taskList'
      ]
    },
    Prepress: {
      department: 'Prepress',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'taskList'
      ]
    },
    Production: {
      department: 'Production',
      visibleElements: [
        'orderApprovals',
        'recentOrders',
        'statusSummary',
        'productionTimeline',
        'taskList'
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
        'deliverySchedule'
      ]
    }
  }
};
