
import { Department, DesignStatus, OrderStatus, PermissionKey, PrepressStatus, ProductionStage, ProductionStatus, Role, User } from "@/types";
import { toast } from "sonner";

// Demo users for the application
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    department: "Sales",
    role: "Admin",
    permissions: [
      "view_orders",
      "create_orders",
      "update_orders",
      "delete_orders",
      "view_users",
      "manage_users",
      "manage_departments",
      "update_order_status",
      "verify_orders",
      "dispatch_orders",
      "view_reports",
      "export_data",
      "view_analytics",
      "manage_settings",
      "view_address_details"
    ]
  },
  {
    id: "2",
    name: "Sales Manager",
    email: "sales@example.com",
    department: "Sales",
    role: "Manager",
    permissions: [
      "view_orders",
      "create_orders",
      "update_orders",
      "update_order_status",
      "verify_orders",
      "dispatch_orders",
      "view_reports",
      "view_address_details"
    ]
  },
  {
    id: "3",
    name: "Design Team",
    email: "design@example.com",
    department: "Design",
    role: "User",
    permissions: [
      "view_orders",
      "update_order_status"
    ]
  },
  {
    id: "4",
    name: "Prepress Team",
    email: "prepress@example.com",
    department: "Prepress",
    role: "User",
    permissions: [
      "view_orders",
      "update_order_status"
    ]
  },
  {
    id: "5",
    name: "Production Team",
    email: "production@example.com",
    department: "Production",
    role: "User",
    permissions: [
      "view_orders",
      "update_order_status",
      "view_address_details"
    ]
  }
];

// Function to get allowed statuses based on department
export const getAllowedStatusesForDepartment = (department: Department): string[] => {
  switch (department) {
    case 'Sales':
      return ['In Progress', 'On Hold', 'Completed', 'Dispatched', 'Issue'];
    case 'Design':
      return ['Working on it', 'Pending Feedback from Sales Team', 'Forwarded to Prepress'];
    case 'Prepress':
      return ['Waiting for approval', 'Working on it', 'Forwarded to production'];
    case 'Production':
      return ['In Progress', 'On Hold', 'Ready to Dispatch', 'Completed', 'Issue'];
    default:
      return ['In Progress', 'On Hold', 'Completed', 'Issue'];
  }
};

// Function to determine what department comes next in the workflow
export const getNextDepartment = (currentDepartment: Department): Department | null => {
  switch (currentDepartment) {
    case 'Sales':
      return 'Design';
    case 'Design':
      return 'Prepress';
    case 'Prepress':
      return 'Production';
    case 'Production':
      return 'Sales'; // Back to sales for dispatch
    default:
      return null;
  }
};

// Status color classes helper
export const getStatusColorClass = (status: string): string => {
  // Base styling for all badges
  let baseClass = "px-2 py-1 rounded-full text-xs font-medium";
  
  // Department specific statuses
  if (status === "Working on it" || status === "In Progress") {
    return `${baseClass} bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100`;
  }
  
  if (status === "Pending Feedback from Sales Team" || status === "Waiting for approval") {
    return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100`;
  }
  
  if (status === "Forwarded to Prepress" || status === "Forwarded to production") {
    return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`;
  }
  
  if (status === "Ready to Dispatch") {
    return `${baseClass} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
  }
  
  // Generic statuses
  switch (status) {
    case "Completed":
    case "Dispatched":
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
    case "On Hold":
      return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100`;
    case "Issue":
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
    default:
      return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`;
  }
};

// Mock function to generate notifications
export const generateNotification = (
  order: { id: string; orderNumber: string, currentDepartment: Department, status: string },
  forDepartments: Department[] = ["Sales", "Design", "Prepress", "Production"]
) => {
  const getNotificationMessage = () => {
    if (order.status === "Pending Feedback from Sales Team") {
      return `Order ${order.orderNumber} requires feedback from Sales Team`;
    }
    if (order.status === "Waiting for approval") {
      return `Order ${order.orderNumber} is waiting for approval from Sales Team`;
    }
    if (order.status === "Ready to Dispatch") {
      return `Order ${order.orderNumber} is ready for dispatch`;
    }
    return `Order ${order.orderNumber} status updated to ${order.status}`;
  };
  
  toast(getNotificationMessage(), {
    description: `Current department: ${order.currentDepartment}`,
    action: {
      label: "View",
      onClick: () => {
        console.log("View order clicked:", order.id);
        // In a real app, this would navigate to the order detail
      }
    }
  });
};

// Get all departments
export const getDepartments = (): Department[] => {
  return ["Sales", "Design", "Prepress", "Production"];
};

// Get production stages in sequence
export const getProductionStages = (): ProductionStage[] => {
  return [
    "Printing",
    "Pasting",
    "Cutting",
    "Foiling", 
    "Letterpress",
    "Embossed", 
    "Diecut",
    "Quality Check",
    "Ready to Dispatch"
  ];
};

// Helper function to determine if an order can be edited by a department
export const canDepartmentEditOrder = (department: Department, currentDepartment: Department): boolean => {
  if (department === 'Sales') return true; // Sales can always edit
  return department === currentDepartment; // Other departments can only edit if they're the current department
};
