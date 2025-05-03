
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
