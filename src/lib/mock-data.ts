
import { cn } from "@/lib/utils";
import { Department, ProductionStage } from "@/types";

// Function to get status color class for badges
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'New':
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
    case 'In Progress':
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200";
    case 'Completed':
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
    case 'On Hold':
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200";
    case 'Issue':
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
    case 'Pending':
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200";
    case 'Paid':
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
    case 'Partially Paid':
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200";
    case 'Not Paid':
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
    case 'Working on it':
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
    case 'Pending Feedback':
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200";
    case 'Reviewing':
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200";
    case 'Ready':
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200";
  }
}

// Function to get department color class
export function getDepartmentColorClass(department: string): string {
  switch (department) {
    case 'Sales':
      return "text-blue-600 dark:text-blue-400";
    case 'Production':
      return "text-green-600 dark:text-green-400";
    case 'Design':
      return "text-purple-600 dark:text-purple-400";
    case 'Prepress':
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-foreground";
  }
}

// Function to get stage number for order status
export function getOrderStageNumber(status: string): number {
  switch (status) {
    case 'New':
      return 1;
    case 'In Progress':
      return 2;
    case 'On Hold':
      return 2; // On hold is still considered "in progress" stage
    case 'Completed':
      return 3;
    case 'Issue':
      return 0; // Issues are a special case, not part of normal flow
    default:
      return 0;
  }
}

// Function to get all departments
export function getDepartments(): Department[] {
  return ['Sales', 'Production', 'Design', 'Prepress'];
}

// Function to get all production stages
export function getProductionStages(): ProductionStage[] {
  return [
    'Printing',
    'Cutting',
    'Pasting',
    'Foiling',
    'Electroplating',
    'Letterpress',
    'Embossing',
    'Ready to Dispatch'
  ];
}

// Function to get next department in workflow
export function getNextDepartment(currentDepartment: Department): Department | null {
  switch (currentDepartment) {
    case 'Sales':
      return 'Design';
    case 'Design':
      return 'Prepress';
    case 'Prepress':
      return 'Production';
    case 'Production':
      return null; // End of workflow
    default:
      return null;
  }
}

// Function to check if user can view financial data
export function canViewFinancialData(department: Department, role: string): boolean {
  return department === 'Sales' || role === 'Admin';
}

// Function to check if user can edit order
export function canEditOrder(department: Department, orderDepartment: Department, role: string): boolean {
  return department === orderDepartment || role === 'Admin';
}
