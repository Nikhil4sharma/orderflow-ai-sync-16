
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterOptions, Order } from "@/types";
import { endOfDay, isWithinInterval, parseISO, startOfDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Filter orders by multiple criteria
export function filterOrdersByMultipleCriteria(orders: Order[], filterOptions: FilterOptions): Order[] {
  return orders.filter(order => {
    // Filter by department
    if (filterOptions.department && filterOptions.department !== 'All') {
      if (order.currentDepartment !== filterOptions.department) {
        return false;
      }
    }
    
    // Filter by status
    if (filterOptions.status && filterOptions.status !== 'All') {
      if (order.status !== filterOptions.status) {
        return false;
      }
    }
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      const searchableFields = [
        order.orderNumber,
        order.clientName,
        order.id,
        ...(order.items || [])
      ].map(item => (item || '').toString().toLowerCase());
      
      if (!searchableFields.some(field => field.includes(query))) {
        return false;
      }
    }
    
    // Filter by date range
    if (filterOptions.dateRange) {
      const orderDate = parseISO(order.createdAt);
      const { start, end } = filterOptions.dateRange;
      
      if (start && end) {
        // Set time to start of day for start and end of day for end
        const startDate = startOfDay(start);
        const endDate = endOfDay(end);
        
        if (!isWithinInterval(orderDate, { start: startDate, end: endDate })) {
          return false;
        }
      }
    }
    
    // If it passes all filters, include it
    return true;
  });
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

// Get workflow stage number (for progress indicators)
export function getWorkflowStageNumber(status: string): number {
  const workflowStages = ["New", "In Progress", "Completed", "Verified", "Dispatched"];
  const stageIndex = workflowStages.findIndex(stage => stage === status);
  return stageIndex !== -1 ? stageIndex + 1 : 1;
}

// Get total workflow stages
export function getTotalWorkflowStages(): number {
  return 5; // New, In Progress, Completed, Verified, Dispatched
}

// Calculate workflow progress percentage
export function calculateWorkflowProgress(status: string): number {
  const current = getWorkflowStageNumber(status);
  const total = getTotalWorkflowStages();
  return Math.floor((current / total) * 100);
}
