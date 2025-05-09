import { Order, User } from "@/types";
import { PermissionKey } from "@/types/common";

// Check if a user has a specific permission
export const hasPermission = (user: User | null | undefined, permission: PermissionKey): boolean => {
  if (!user) return false;
  
  // Admin always has all permissions
  if (user.role === "Admin") return true;
  
  return user.permissions.includes(permission);
};

// Check if a user can request approval from sales
export const canRequestApprovalFromSales = (user: User | null | undefined): boolean => {
  if (!user) return false;
  
  // Admin can always do this
  if (user.role === "Admin") return true;
  
  // Only Design and Prepress can request approval from Sales
  if ((user.department === "Design" || user.department === "Prepress") && 
      user.permissions.includes("request_approval" as PermissionKey)) {
    return true;
  }
  
  return false;
};

// Check if a user can forward to another department
export const canForwardToDepartment = (
  user: User | null | undefined, 
  fromDepartment: string, 
  toDepartment: string
): boolean => {
  if (!user) return false;
  
  // Admin can always do this
  if (user.role === "Admin") return true;
  
  // Sales can forward to any department
  if (user.department === "Sales" && user.permissions.includes("forward_to_department")) {
    return true;
  }
  
  // Design can only forward to Prepress
  if (user.department === "Design" && toDepartment === "Prepress" && 
      user.permissions.includes("forward_to_department")) {
    return true;
  }
  
  // Prepress can only forward to Production (after approval)
  if (user.department === "Prepress" && toDepartment === "Production" && 
      user.permissions.includes("forward_to_department")) {
    return true;
  }
  
  return false;
};

// Check if the user can view address details for an order
export const canViewAddressDetails = (user: User | null | undefined, order: Order): boolean => {
  if (!user) return false;
  
  // Admin always has access
  if (user.role === "Admin") return true;
  
  // Users with the specific permission have access
  if (user.permissions.includes("view_address_details")) return true;
  
  // Sales department and the final department can see address details
  if (user.department === "Sales" || order.currentDepartment === "Production") {
    return true;
  }
  
  // Production can view delivery details when order is "Ready to Dispatch"
  if (user.department === "Production" && order.status === "Ready to Dispatch") {
    return true;
  }
  
  return false;
};

// Check if user can mark an order as Ready to Dispatch
export const canMarkReadyToDispatch = (user: User | null | undefined, order: Order): boolean => {
  if (!user) return false;
  
  // Admin can always do this
  if (user.role === "Admin") return true;
  
  // Only Production department can mark as Ready to Dispatch
  if (user.department === "Production" && order.currentDepartment === "Production" &&
      user.permissions.includes("mark_ready_dispatch")) {
    // Order must be fully paid
    if (order.paymentStatus === "Paid") {
      return true;
    }
  }
  
  return false;
};

// Check if user can verify payment
export const canVerifyPayment = (user: User | null | undefined): boolean => {
  if (!user) return false;
  
  // Admin can always do this
  if (user.role === "Admin") return true;
  
  // Only Sales department can verify payment
  if (user.department === "Sales" && user.permissions.includes("verify_payment")) {
    return true;
  }
  
  return false;
};

// Get all permissions a role should have
export const getRolePermissions = (role: string, department: string): PermissionKey[] => {
  // Base permissions for all roles
  let permissions: PermissionKey[] = ["view_orders"];
  
  switch (role) {
    case "Admin":
      return [
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
        "view_address_details",
        "request_approval",
        "provide_approval",
        "forward_to_department",
        "mark_ready_dispatch",
        "verify_payment",
        "view_delivery_details"
      ];
    case "Manager":
      permissions = [
        ...permissions,
        "create_orders",
        "update_orders",
        "update_order_status",
        "view_reports"
      ];
      break;
    case "User":
      permissions = [
        ...permissions,
        "update_order_status"
      ];
      break;
  }
  
  // Add department-specific permissions
  switch (department) {
    case "Sales":
      permissions = [
        ...permissions,
        "create_orders",
        "update_orders",
        "provide_approval",
        "forward_to_department",
        "verify_payment",
        "view_delivery_details",
        "dispatch_orders",
        "view_address_details"
      ];
      break;
    case "Design":
      permissions = [
        ...permissions,
        "request_approval",
        "forward_to_department"
      ];
      break;
    case "Prepress":
      permissions = [
        ...permissions,
        "request_approval",
        "forward_to_department"
      ];
      break;
    case "Production":
      permissions = [
        ...permissions,
        "mark_ready_dispatch",
        "view_delivery_details",
        "view_address_details"
      ];
      break;
  }
  
  return permissions;
};
