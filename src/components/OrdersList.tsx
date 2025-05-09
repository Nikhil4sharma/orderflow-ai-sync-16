import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Order, OrderStatus, Department, User } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter } from "lucide-react";

function formatDateSafe(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "N/A";
}

interface OrdersListProps {
  orders: Order[];
  currentUser: User;
  showTabs?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  showDepartmentFilter?: boolean;
  getTabStatus?: (order: Order) => OrderStatus | "All" | string;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  currentUser,
  showTabs = true,
  showSearch = true,
  showSort = true,
  showDepartmentFilter = true,
  getTabStatus,
}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // If getTabStatus is provided, use it to group orders by tab
  let tabbedOrders = orders;
  if (getTabStatus) {
    tabbedOrders = orders.map(order => ({ ...order, _tabStatus: getTabStatus(order) }));
  }

  // Filter orders based on department access and search text
  let filteredOrders = tabbedOrders.filter(order => {
    // Department-based access control
    if (currentUser?.role !== "Admin" && 
        currentUser?.department !== order.currentDepartment && 
        !["Sales"].includes(currentUser?.department || "")) {
      return false;
    }
    // Department filter
    if (departmentFilter !== "All" && order.currentDepartment !== departmentFilter) {
      return false;
    }
    // Status filter
    if (selectedStatus && (order._tabStatus || order.status) !== selectedStatus) {
      return false;
    }
    // Amount filter
    if (minAmount && order.amount < parseFloat(minAmount)) {
      return false;
    }
    if (maxAmount && order.amount > parseFloat(maxAmount)) {
      return false;
    }
    // Search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.clientName.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Sort orders
  filteredOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      case "status-asc":
        return a.status.localeCompare(b.status);
      case "status-desc":
        return b.status.localeCompare(a.status);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get counts for each status
  const getStatusCount = (status: OrderStatus | "All"): number => {
    if (status === "All") {
      return orders.length;
    }
    return orders.filter(order => order.status === status).length;
  };

  // Create filter tabs - defined statuses plus "All" special case for filtering
  const statuses: (OrderStatus | "All")[] = ["All", "In Progress", "Pending Approval", "Issue", "Ready to Dispatch", "Completed"];
  const departments = ["All", "Sales", "Production", "Design", "Prepress", "Admin"];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        )}
        {showDepartmentFilter && (
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm hidden sm:inline">Filter:</span>
        </div>
        <Input
          type="number"
          placeholder="Min Amount"
          className="w-28"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Amount"
          className="w-28"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
        {showSort && (
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Amount High to Low</SelectItem>
              <SelectItem value="amount-asc">Amount Low to High</SelectItem>
              <SelectItem value="status-asc">Status A-Z</SelectItem>
              <SelectItem value="status-desc">Status Z-A</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {showTabs && (
        <div className="flex flex-wrap gap-2 mb-4">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={(selectedStatus === status) || (status === "All" && selectedStatus === null) ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setSelectedStatus(status === "All" ? null : status)}
            >
              {status}
              <span className="ml-2 bg-primary-foreground text-primary rounded-full h-6 min-w-6 flex items-center justify-center px-1.5 text-xs">
                {getStatusCount(status)}
              </span>
            </Button>
          ))}
        </div>
      )}
      {filteredOrders.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground text-center mt-2">
              {searchText ? "Try a different search term or filter" : "There are no orders to display"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="w-full hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Department</span>
                    <p>{order.currentDepartment}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount</span>
                    <p>₹{order.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created</span>
                    <p>{formatDateSafe(order.createdAt)}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList; 