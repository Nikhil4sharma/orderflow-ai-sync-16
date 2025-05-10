import { Order, Department, OrderStatus, PaymentStatus } from '@/types/common';

// Get next department in the workflow
export function getNextDepartment(currentDepartment: Department): Department | null {
  const workflow: Department[] = ['Sales', 'Design', 'Prepress', 'Production', 'Admin'];
  const currentIndex = workflow.indexOf(currentDepartment);
  if (currentIndex < 0 || currentIndex === workflow.length - 1) {
    return null;
  }
  return workflow[currentIndex + 1];
}

// Get color for order status
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'Completed':
    case 'Verified':
    case 'Design Approved':
    case 'Prepress Approved':
    case 'Approved':
    case 'Payment Verified':
    case 'Payment Recorded: Paid':
    case 'Paid':
      return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300';
    
    case 'In Progress':
    case 'New':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300';
    
    case 'On Hold':
    case 'Pending Approval':
    case 'Pending Payment':
    case 'Payment Recorded: Partial':
    case 'Partial Payment Received':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300';
    
    case 'Issue':
    case 'Rejected':
    case 'Design Rejected':
    case 'Prepress Rejected':
    case 'Payment Recorded: Not Paid':
      return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300';
    
    case 'Ready to Dispatch':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300';
    
    case 'Dispatched':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-800/20 dark:text-teal-300';
    
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
  }
}

// Get payment status color
export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300';
    
    case 'Partial':
    case 'Partially Paid':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300';
    
    case 'Not Paid':
      return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300';
    
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
  }
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    clientName: 'Acme Corp',
    amount: 5000,
    paidAmount: 5000,
    pendingAmount: 0,
    items: ['Business Cards', 'Brochures'],
    createdAt: '2023-06-15T10:30:00Z',
    lastUpdated: '2023-06-16T14:20:00Z',
    status: 'Completed' as OrderStatus,
    currentDepartment: 'Production' as Department,
    paymentStatus: 'Paid' as PaymentStatus,
    statusHistory: [],
    paymentHistory: []
  },
  // ... Other orders
];
