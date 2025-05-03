
import { Department, Order, ProductionStage, User } from "@/types";

// Get all departments
export const getDepartments = (): Department[] => {
  return ["Sales", "Design", "Prepress", "Production"];
};

// Get production stages
export const getProductionStages = (): ProductionStage[] => {
  return [
    "Material Preparation", 
    "Machine Setup", 
    "Printing", 
    "Finishing", 
    "Quality Check", 
    "Packing"
  ];
};

// Get next department in workflow
export const getNextDepartment = (currentDepartment: Department): Department | null => {
  const workflow: Department[] = ["Sales", "Design", "Prepress", "Production"];
  const currentIndex = workflow.findIndex(dept => dept === currentDepartment);
  
  if (currentIndex === -1 || currentIndex === workflow.length - 1) {
    return null;
  }
  
  return workflow[currentIndex + 1];
};

// Get status color class based on status
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case "New":
      return "px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "In Progress":
      return "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Completed":
      return "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "On Hold":
      return "px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Issue":
      return "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "Verified":
      return "px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
    case "Dispatched":
      return "px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    default:
      return "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Check if user can view financial data
export const canViewFinancialData = (department: Department | undefined, role: string | undefined): boolean => {
  if (role === 'Admin') return true;
  return department === 'Sales';
};

// Mock users for demo/testing
export const demoUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    department: "Sales",
    role: "Admin"
  },
  {
    id: "sales-1",
    name: "Sales User",
    email: "sales@example.com",
    department: "Sales",
    role: "Sales"
  },
  {
    id: "design-1",
    name: "Design User",
    email: "design@example.com",
    department: "Design",
    role: "Design"
  },
  {
    id: "prepress-1",
    name: "Prepress User",
    email: "prepress@example.com",
    department: "Prepress",
    role: "Prepress"
  },
  {
    id: "production-1",
    name: "Production User",
    email: "production@example.com",
    department: "Production",
    role: "Production"
  }
];

// Get workflow stages
export const getWorkflowStages = (): string[] => {
  return ["New", "In Progress", "Completed", "Verified", "Dispatched"];
};

// Get allowed statuses for a department
export const getAllowedStatusesForDepartment = (department: Department): string[] => {
  switch (department) {
    case "Sales":
      return ["New", "In Progress", "On Hold", "Issue", "Verified", "Dispatched"];
    case "Design":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    case "Prepress":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    case "Production":
      return ["In Progress", "Completed", "On Hold", "Issue"];
    default:
      return ["New", "In Progress", "Completed", "On Hold", "Issue"];
  }
};

// Get workflow stage description
export const getWorkflowStageDescription = (status: string): string => {
  switch (status) {
    case "New":
      return "Order has been created but processing hasn't started.";
    case "In Progress":
      return "Order is currently being processed.";
    case "Completed":
      return "Order production is complete.";
    case "Verified":
      return "Order has been verified by Sales and is ready for dispatch.";
    case "Dispatched":
      return "Order has been sent to the customer.";
    case "On Hold":
      return "Order processing has been paused.";
    case "Issue":
      return "There's a problem with this order that needs attention.";
    default:
      return "Status information not available.";
  }
};
