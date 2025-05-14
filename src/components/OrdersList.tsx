
import React, { useCallback, useMemo } from "react";
import { Department, Order } from "@/types";
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
  department?: Department;
  getTabStatus?: (order: Order) => string;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  showTabs = true,
  showFilters = true,
  onFilterChange,
  activeFilter = "all",
  department = "Sales",
  getTabStatus
}) => {
  // Define department-specific tabs
  const getDepartmentTabs = () => {
    switch (department) {
      case "Sales":
        return [
          { id: "all", label: "All" },
          { id: "new", label: "New Order" },
          { id: "inProgress", label: "In Progress" },
          { id: "completed", label: "Completed" }
        ];
      case "Design":
        return [
          { id: "all", label: "All" },
          { id: "pendingDesign", label: "Pending Design" },
          { id: "designApproved", label: "Design Approved" }
        ];
      case "Prepress":
        return [
          { id: "all", label: "All" },
          { id: "pendingPrepress", label: "Pending Prepress" },
          { id: "prepressApproved", label: "Prepress Approved" }
        ];
      case "Production":
        return [
          { id: "all", label: "All" },
          { id: "new", label: "New" },
          { id: "inProgress", label: "In Progress" },
          { id: "completed", label: "Completed" }
        ];
      default:
        return [
          { id: "all", label: "All" },
          { id: "inProgress", label: "In Progress" },
          { id: "completed", label: "Completed" }
        ];
    }
  };
  
  const tabs = getDepartmentTabs();

  // Filter orders based on active filter
  const filteredOrders = useMemo(() => {
    if (!showFilters || activeFilter === "all") {
      return orders;
    }

    // Filter by custom function if provided
    if (getTabStatus) {
      return orders.filter(order => getTabStatus(order).toLowerCase() === activeFilter.toLowerCase());
    }

    // Filter by department-specific logic
    return orders.filter((order) => {
      switch (activeFilter) {
        case "new":
          return order.status === "New" || 
                (department === "Production" && order.status === "In Progress");
        case "pendingDesign":
          return order.status === "In Progress" || 
                (order.currentDepartment === "Design" && order.status === "In Progress");
        case "pendingPrepress":
          return order.currentDepartment === "Prepress" && order.status === "In Progress";
        case "designApproved":
          return order.status === "Design Approved" || order.status === "Approved";
        case "prepressApproved":
          return order.status === "Prepress Approved" || order.status === "Approved";
        case "inProgress":
          return order.status === "In Progress";
        case "completed":
          return order.status === "Completed";
        case "pendingApproval":
          return order.status === "Pending Approval" || order.status === "In Progress";
        case "onHold":
          return order.status === "On Hold";
        default:
          return true;
      }
    });
  }, [orders, activeFilter, showFilters, getTabStatus, department]);

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
            <TabsList className={`grid grid-cols-${tabs.length} w-auto`}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
              ))}
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
