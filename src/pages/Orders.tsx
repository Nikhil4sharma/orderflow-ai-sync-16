import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { FileText, Search, PlusCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrdersList from "@/components/OrdersList";

// Custom tab logic: if order.status is 'Pending Approval' or remarks/status indicate 'Pending Feedback from Sales Team', show in Pending Approval tab
const getTabStatus = (order) => {
  if (
    order.status === "Pending Approval" ||
    order.remarks === "Pending Feedback from Sales Team" ||
    order.designStatus === "Pending Feedback from Sales Team" ||
    order.prepressStatus === "Waiting for approval"
  ) {
    return "Pending Approval";
  }
  // Add more logic as needed for other tabs
  return order.status;
};

const Orders: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const navigate = useNavigate();
  
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Filter orders based on department access and search text
  let filteredOrders = orders.filter(order => {
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
    if (selectedStatus && order.status !== selectedStatus) {
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

  if (!currentUser) return null;
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={() => navigate("/new-order")}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> New Order
          </Button>
        </div>
      </div>
      <OrdersList orders={orders} currentUser={currentUser} getTabStatus={getTabStatus} />
    </div>
  );
};

export default Orders;
