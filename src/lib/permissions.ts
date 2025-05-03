
import { User, Department, UserRole, Order, PermissionKey } from "@/types";

// Define role-based permissions map
const rolePermissions: Record<UserRole, PermissionKey[]> = {
  Admin: [
    "view_financial_data",
    "dispatch_orders",
    "verify_orders",
    "update_order_status",
    "view_full_timeline",
    "view_address_details",
    "edit_orders",
    "admin_dashboard",
    "manage_users"
  ],
  Sales: [
    "view_financial_data",
    "dispatch_orders",
    "verify_orders",
    "update_order_status",
    "view_full_timeline",
    "view_address_details",
    "edit_orders"
  ],
  Design: [
    "update_order_status"
  ],
  Prepress: [
    "update_order_status"
  ],
  Production: [
    "update_order_status",
    "view_address_details"
  ]
};

// Department-specific permissions
const departmentPermissions: Record<Department, PermissionKey[]> = {
  Sales: ["view_financial_data", "dispatch_orders", "verify_orders"],
  Design: [],
  Prepress: [],
  Production: []
};

// Helper function to check if a user has a specific permission
export const hasPermission = (user: User | null, permission: PermissionKey): boolean => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === "Admin") return true;
  
  // Check role-based permissions
  const userRolePermissions = rolePermissions[user.role] || [];
  if (userRolePermissions.includes(permission)) return true;
  
  // Check department-based permissions
  const userDeptPermissions = departmentPermissions[user.department] || [];
  if (userDeptPermissions.includes(permission)) return true;
  
  return false;
};

// Specific permission checkers
export const canViewFinancialData = (user: User | null): boolean => {
  return hasPermission(user, "view_financial_data");
};

export const canDispatchOrders = (user: User | null): boolean => {
  return hasPermission(user, "dispatch_orders");
};

export const canVerifyOrders = (user: User | null): boolean => {
  return hasPermission(user, "verify_orders");
};

export const canUpdateOrderStatus = (user: User | null): boolean => {
  return hasPermission(user, "update_order_status");
};

export const canViewFullTimeline = (user: User | null): boolean => {
  return hasPermission(user, "view_full_timeline");
};

export const canViewAddressDetails = (user: User | null, order: Order): boolean => {
  if (hasPermission(user, "view_address_details")) return true;
  
  // Production can view address details when order is ready to dispatch
  if (user?.department === "Production" && order.status === "Completed") return true;
  
  return false;
};

export const canEditOrder = (user: User | null): boolean => {
  return hasPermission(user, "edit_orders");
};

export const canAccessAdminDashboard = (user: User | null): boolean => {
  return hasPermission(user, "admin_dashboard");
};

export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, "manage_users");
};

// Function to check if user is from current department or admin
export const isCurrentDepartmentOrAdmin = (user: User | null, order: Order | null): boolean => {
  if (!user || !order) return false;
  return user.role === "Admin" || user.department === order.currentDepartment;
};

// Function to filter order data based on user permissions
export function filterOrderDataForUser(order: Order, user: User): Partial<Order> {
  // Admin and Sales can view everything
  if (user.role === "Admin" || user.role === "Sales") {
    return order;
  }
  
  // For other departments, filter out financial information
  const filteredOrder: Partial<Order> = {
    ...order,
    orderNumber: order.orderNumber,
    clientName: order.clientName,
    items: order.items,
    status: order.status,
    currentDepartment: order.currentDepartment,
    statusHistory: order.statusHistory,
    productStatus: order.productStatus
  };
  
  // Remove financial data
  delete filteredOrder.amount;
  delete filteredOrder.paidAmount;
  delete filteredOrder.pendingAmount;
  delete filteredOrder.paymentStatus;
  delete filteredOrder.paymentHistory;
  
  return filteredOrder;
}
