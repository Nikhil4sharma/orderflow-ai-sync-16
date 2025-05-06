
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
  
  return (
    <Tabs value={activeStatus} onValueChange={onChange} className="w-full">
      <TabsList className="w-full mb-4 h-auto flex flex-wrap bg-transparent gap-2">
        {statuses.map(status => (
          <TabsTrigger 
            key={status} 
            value={status} 
            className={`
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
              relative px-4 py-2 h-auto transition-all 
              border border-border rounded-md
              hover:bg-muted
              ${isMobile ? "text-xs py-1.5 px-2.5 flex-1 min-w-fit" : ""}
            `}
          >
            <span className="mr-1">{status}</span>
            {countByStatus[status] > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium rounded-full bg-muted-foreground/20 text-zinc-950">
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
