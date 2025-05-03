
import { Department, Order, ProductionStage } from "@/types";

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
