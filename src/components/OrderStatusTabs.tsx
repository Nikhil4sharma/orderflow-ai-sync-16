
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderStatus } from "@/types";

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
  const statuses = [
    "All",
    "In Progress",
    "Pending Approval",
    "Issue",
    "Ready to Dispatch",
    "Completed"
  ];

  return (
    <Tabs value={activeStatus} onValueChange={onChange} className="w-full">
      <TabsList className="w-full mb-4 h-auto flex flex-wrap bg-transparent gap-2">
        {statuses.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative px-4 py-2 h-auto"
          >
            {status}
            {countByStatus[status] > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
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
