import React from "react";
import { useUsers } from "@/contexts/UserContext";
import { PermissionKey } from "@/types/common";

interface CanAccessProps {
  permission?: PermissionKey;
  children: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({ permission, children }) => {
  const { hasPermission } = useUsers();
  
  // If no permission is specified, or user has the permission, render children
  if (!permission || hasPermission(permission)) {
    return <>{children}</>;
  }
  
  // Otherwise, render nothing
  return null;
};

export default CanAccess;
