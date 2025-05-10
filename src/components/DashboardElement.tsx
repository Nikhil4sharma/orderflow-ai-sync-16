
import { CanAccess } from "@/components/CanAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardElementProps {
  id: string;
  title: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  permission?: string;
  className?: string;
  children: React.ReactNode;
}

const DashboardElement = ({
  id,
  title,
  description,
  loading = false,
  error = null,
  permission,
  className,
  children,
}: DashboardElementProps) => {
  const { canUserSeeElement } = useOrders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user can see this element
  if (mounted && !canUserSeeElement(id)) {
    return null;
  }

  return (
    <CanAccess permission={permission as any}>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ) : error ? (
            <div className="flex items-center p-4 text-sm text-red-500 border border-red-200 bg-red-50 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p>{error}</p>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </CanAccess>
  );
};

export default DashboardElement;
