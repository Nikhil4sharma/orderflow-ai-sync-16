
import React from "react";
import { useUsers } from "@/contexts/UserContext";
import { PermissionKey } from "@/types";

interface CanAccessProps {
  permission?: PermissionKey;
  children: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({ permission, children }) => {
  const { currentUser } = useUsers();
  
  // If no permission is specified, or user has the permission, render children
  if (!permission || currentUser?.permissions?.includes(permission)) {
    return <>{children}</>;
  }
  
  // Otherwise, render nothing
  return null;
};

export default CanAccess;
