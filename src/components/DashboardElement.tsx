
import React from "react";
import CanAccess from "@/components/CanAccess";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PermissionKey } from "@/types";

interface DashboardElementProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  permission?: PermissionKey;
  elementId?: string;
}

const DashboardElement: React.FC<DashboardElementProps> = ({
  title,
  description,
  children,
  className,
  permission,
  elementId
}) => {
  const { canUserSeeElement } = useOrders();

  // Check if the user can see this element based on their department/role
  if (elementId && !canUserSeeElement(elementId)) {
    return null;
  }

  return (
    <CanAccess permission={permission as PermissionKey}>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-0">{children}</CardContent>
      </Card>
    </CanAccess>
  );
};

export default DashboardElement;
