
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderStatusTabsProps {
  activeStatus: string;
  onChange: (status: string) => void;
  countByStatus: Record<string, number>;
}

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  activeStatus,
  onChange,
  countByStatus
}) => {
  const isMobile = useIsMobile();
  const statuses = ["All", "New", "In Progress", "Pending Approval", "Issue", "Ready to Dispatch", "Completed", "On Hold"];
  
  // Get status-specific color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Completed":
        return "bg-green-600 text-white hover:bg-green-700 border-green-600";
      case "New":
        return "bg-blue-600 text-white hover:bg-blue-700 border-blue-600";
      case "In Progress":
        return "bg-amber-600 text-white hover:bg-amber-700 border-amber-600";
      case "Issue":
        return "bg-red-600 text-white hover:bg-red-700 border-red-600";
      case "Ready to Dispatch":
        return "bg-purple-600 text-white hover:bg-purple-700 border-purple-600";
      case "Pending Approval":
        return "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600";
      case "On Hold":
        return "bg-gray-600 text-white hover:bg-gray-700 border-gray-600";
      default:
        return ""; // Will use default styles
    }
  };

  // Get the count badge style based on status
  const getBadgeStyle = (status: string): string => {
    if (activeStatus === status) {
      return "bg-white/20 text-white";
    }
    
    switch (status) {
      case "Completed":
        return "bg-white/90 text-green-700";
      case "New":
        return "bg-white/90 text-blue-700";
      case "In Progress":
        return "bg-white/90 text-amber-700";
      case "Issue":
        return "bg-white/90 text-red-700";
      case "Ready to Dispatch":
        return "bg-white/90 text-purple-700";
      case "Pending Approval":
        return "bg-white/90 text-indigo-700";
      case "On Hold":
        return "bg-white/90 text-gray-700";
      default:
        return "bg-primary/10 text-primary dark:bg-primary/20";
    }
  };
  
  return (
    <Tabs value={activeStatus} onValueChange={onChange} className="w-full">
      <TabsList className="w-full mb-4 h-auto flex flex-wrap bg-transparent gap-2">
        {statuses.map(status => (
          <TabsTrigger 
            key={status} 
            value={status} 
            className={cn(
              "relative px-4 py-2 h-auto transition-all",
              "border rounded-md shadow-sm",
              "hover:bg-muted hover:scale-105 active:scale-100 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
              activeStatus === status ? 
                (status === "All" ? 
                  "bg-primary text-primary-foreground border-primary" : 
                  getStatusColor(status)
                ) : 
                "bg-card border-border",
              isMobile ? "text-xs py-1.5 px-2.5 flex-1 min-w-fit" : ""
            )}
            aria-label={`Filter by ${status} status`}
          >
            <span className="font-medium">{status}</span>
            {countByStatus[status] > 0 && (
              <Badge className={cn(
                "ml-1.5 min-w-[1.5rem] h-5 px-1 text-xs font-medium rounded-full inline-flex items-center justify-center",
                getBadgeStyle(status)
              )}>
                {countByStatus[status]}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default OrderStatusTabs;
