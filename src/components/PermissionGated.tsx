
import React, { ReactNode } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { PermissionKey } from "@/types";
import { hasPermission } from "@/lib/permissions";

interface PermissionGatedProps {
  requiredPermission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that only renders its children if the current user has the required permission
 */
const PermissionGated: React.FC<PermissionGatedProps> = ({ 
  requiredPermission, 
  children, 
  fallback = null 
}) => {
  const { currentUser } = useOrders();
  
  const userHasPermission = hasPermission(currentUser, requiredPermission);
  
  if (userHasPermission) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGated;
