
import { Order, PermissionKey, User } from "@/types";

// Check if a user has a specific permission
export const hasPermission = (user: User | null | undefined, permission: PermissionKey): boolean => {
  if (!user) return false;
  
  // Admin always has all permissions
  if (user.role === "Admin") return true;
  
  return user.permissions.includes(permission);
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
  
  return false;
};

// Get all permissions a role should have
export const getRolePermissions = (role: string): PermissionKey[] => {
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
        "view_address_details"
      ];
    case "Manager":
      return [
        "view_orders",
        "create_orders",
        "update_orders",
        "update_order_status",
        "verify_orders",
        "dispatch_orders",
        "view_reports",
        "view_address_details"
      ];
    case "User":
      return [
        "view_orders",
        "update_order_status"
      ];
    default:
      return [];
  }
};
