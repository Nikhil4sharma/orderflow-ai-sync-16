
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats currency with proper locale
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(amount)
}

// Truncates text with ellipsis if it exceeds max length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Convert string to title case
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    }
  );
}

// Filter orders based on multiple criteria
export function filterOrdersByMultipleCriteria(orders: any[], filters: any): any[] {
  return orders.filter(order => {
    // Department filter
    if (filters.department !== 'All' && order.currentDepartment !== filters.department) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'All' && order.status !== filters.status) {
      return false;
    }
    
    // Search term filter (client name, order number, items)
    if (filters.searchTerm && filters.searchTerm !== '') {
      const search = filters.searchTerm.toLowerCase();
      const matchesClient = order.clientName.toLowerCase().includes(search);
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(search);
      const matchesItems = order.items.some((item: string) => 
        item.toLowerCase().includes(search)
      );
      
      if (!matchesClient && !matchesOrderNumber && !matchesItems) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      const orderDate = new Date(order.createdAt);
      
      if (filters.dateRange.start && orderDate < filters.dateRange.start) {
        return false;
      }
      
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Set end date to end of day
        if (orderDate > endDate) {
          return false;
        }
      }
    }
    
    return true;
  });
}

// Generate PDF report from HTML content
export async function generatePDF(content: string, filename: string): Promise<void> {
  // In a real implementation, we would use a library like jspdf or html2pdf
  // For now, we'll just create a simple text file
  try {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Format date range for display
export function formatDateRange(dateRange: { start: Date | null; end: Date | null }): string {
  if (!dateRange.start && !dateRange.end) return 'All time';
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (dateRange.start && dateRange.end) {
    return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
  } else if (dateRange.start) {
    return `From ${formatDate(dateRange.start)}`;
  } else {
    return `Until ${formatDate(dateRange.end)}`;
  }
}
