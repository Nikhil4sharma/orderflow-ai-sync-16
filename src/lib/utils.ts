
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Department, Order, OrderStatus, StatusType } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

export const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Given the department and status, determine if a notification should be sent
export const shouldSendNotification = (department: string, status: string) => {
  if (department === 'Design' && status === 'Pending Feedback from Sales Team') {
    return true;
  }
  
  if (department === 'Prepress' && status === 'Waiting for approval') {
    return true;
  }
  
  if (department === 'Production' && status === 'Ready to Dispatch') {
    return true;
  }
  
  return false;
};

// Check if an order needs approval from Sales or Admin
export const orderNeedsApproval = (order: Order): boolean => {
  // Design department waiting for approval
  if (
    order.currentDepartment === 'Design' && 
    order.designStatus === 'Pending Feedback from Sales Team'
  ) {
    return true;
  }
  
  // Prepress department waiting for approval
  if (
    order.currentDepartment === 'Prepress' && 
    order.prepressStatus === 'Waiting for approval'
  ) {
    return true;
  }
  
  return false;
};

// Get department that needs to approve the order
export const getApprovingDepartment = (order: Order): Department | null => {
  if (orderNeedsApproval(order)) {
    return 'Sales'; // Sales team is always the approving department
  }
  return null;
};

// Check if user can view financial data based on role and department
export const canViewFinancialData = (department: Department, role: string): boolean => {
  if (role === 'Admin') return true;
  return department === 'Sales';
};

// Format timeline for display
export const formatTimeline = (timeline: string | undefined): string => {
  if (!timeline) return 'Not specified';
  
  if (timeline.startsWith('date:')) {
    // Format date-based timeline
    try {
      const dateStr = timeline.replace('date:', '').trim();
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return timeline;
    }
  } else {
    // It's a duration (e.g. "5 hours")
    return timeline;
  }
};

// Get the appropriate status badge color based on status
export const getStatusBadgeColor = (status: OrderStatus | string): string => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'Issue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'Ready to Dispatch':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    case 'Dispatched':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

// Format Indian Rupees
export const formatIndianRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

// Get orders requiring approval for the Sales team or Admin
export const getOrdersRequiringApproval = (orders: Order[]): Order[] => {
  return orders.filter(order => {
    return (
      (order.currentDepartment === 'Design' && order.designStatus === 'Pending Feedback from Sales Team') ||
      (order.currentDepartment === 'Prepress' && order.prepressStatus === 'Waiting for approval')
    );
  });
};

// Get human-readable status for an order's current department
export const getHumanReadableStatus = (order: Order): string => {
  if (order.currentDepartment === 'Design') {
    return order.designStatus || 'In Progress';
  }
  
  if (order.currentDepartment === 'Prepress') {
    return order.prepressStatus || 'In Progress';
  }
  
  if (order.currentDepartment === 'Production') {
    const activeStage = order.productionStages?.find(stage => stage.status === 'processing');
    return activeStage ? `${activeStage.stage} in progress` : order.status;
  }
  
  return order.status;
};
