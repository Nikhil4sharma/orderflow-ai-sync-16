
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
