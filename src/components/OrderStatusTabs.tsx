
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
        return "bg-green-500 text-white hover:bg-green-600";
      case "New":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "In Progress":
        return "bg-amber-500 text-white hover:bg-amber-600";
      case "Issue":
        return "bg-red-500 text-white hover:bg-red-600";
      case "Ready to Dispatch":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "Pending Approval":
        return "bg-indigo-500 text-white hover:bg-indigo-600";
      case "On Hold":
        return "bg-gray-500 text-white hover:bg-gray-600";
      default:
        return ""; // Will use default styles
    }
  };
  
  return (
    <Tabs value={activeStatus} onValueChange={onChange} className="w-full">
      <TabsList className="w-full mb-4 h-auto flex flex-wrap bg-transparent gap-2">
        {statuses.map(status => (
          <TabsTrigger 
            key={status} 
            value={status} 
            className={`
              relative px-4 py-2 h-auto transition-all
              border border-border rounded-md
              hover:bg-muted
              ${activeStatus === status ? 
                (status === "All" ? 
                  "bg-primary text-primary-foreground" : 
                  getStatusColor(status)
                ) : 
                "bg-card"}
              ${isMobile ? "text-xs py-1.5 px-2.5 flex-1 min-w-fit" : ""}
            `}
          >
            <span>{status}</span>
            {countByStatus[status] > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium rounded-full bg-primary/20 text-primary-foreground dark:bg-primary/40 dark:text-primary-foreground">
                {countByStatus[status]}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default OrderStatusTabs;
