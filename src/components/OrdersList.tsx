
import React, { useCallback, useMemo } from "react";
import { Order } from "@/types";
import OrderCard from "./OrderCard";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersListProps {
  orders: Order[];
  showTabs?: boolean;
  showFilters?: boolean;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  showTabs = true,
  showFilters = true,
  onFilterChange,
  activeFilter = "all",
}) => {
  // Filter orders based on active filter
  const filteredOrders = useMemo(() => {
    if (!showFilters || activeFilter === "all") {
      return orders;
    }

    // Filter by status
    return orders.filter((order) => {
      switch (activeFilter) {
        case "inProgress":
          return order.status === "In Progress";
        case "completed":
          return order.status === "Completed";
        case "dispatched":
          return order.status === "Dispatched";
        case "onHold":
          return order.status === "On Hold";
        case "pending":
          return order.status === "Pending Approval" || order.status === "Pending Payment";
        default:
          return true;
      }
    });
  }, [orders, activeFilter, showFilters]);

  const handleTabChange = useCallback(
    (value: string) => {
      if (onFilterChange) {
        onFilterChange(value);
      }
    },
    [onFilterChange]
  );

  const handleClearFilter = useCallback(() => {
    if (onFilterChange) {
      onFilterChange("all");
    }
  }, [onFilterChange]);

  return (
    <div className="space-y-4">
      {showTabs && (
        <Tabs
          defaultValue="all"
          value={activeFilter}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-3">
            <TabsList className="grid grid-cols-6 w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
              <TabsTrigger value="onHold">On Hold</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            {activeFilter !== "all" && showFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilter}
                className="text-xs"
              >
                <FilterX className="h-3.5 w-3.5 mr-1" />
                Clear filter
              </Button>
            )}
          </div>

          <TabsContent value={activeFilter} className="mt-0">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!showTabs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
