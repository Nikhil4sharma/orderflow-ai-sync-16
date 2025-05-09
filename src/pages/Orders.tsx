import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { FileText, Search, PlusCircle, Filter, Calendar, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrderStatus, Department, PaymentStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentStatus | null>(null);
  const [activeView, setActiveView] = useState<"all" | "assigned">("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  
  // Filter orders based on department access and search text
  let filteredOrders = orders.filter(order => {
    // Department-based access control
    if (currentUser?.role !== "Admin" && 
        currentUser?.department !== order.currentDepartment && 
        !["Sales"].includes(currentUser?.department || "")) {
      return false;
    }
    
    // View filter
    if (activeView === "assigned" && order.currentDepartment !== currentUser?.department) {
      return false;
    }
    
    // Status filter
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }
    
    // Department filter
    if (selectedDepartment && order.currentDepartment !== selectedDepartment) {
      return false;
    }
    
    // Payment filter
    if (selectedPayment && order.paymentStatus !== selectedPayment) {
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
      return filteredOrders.length;
    }
    return filteredOrders.filter(order => order.status === status).length;
  };

  // Create filter tabs - defined statuses plus "All" special case for filtering
  const statuses: (OrderStatus | "All")[] = ["All", "In Progress", "Pending Approval", "Issue", "Ready to Dispatch", "Completed"];
  
  // Department options
  const departments: Department[] = ["Sales", "Design", "Prepress", "Production"];
  
  // Payment statuses
  const paymentStatuses: PaymentStatus[] = ["Not Paid", "Partial", "Paid", "Partially Paid"];
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedDepartment(null);
    setSelectedPayment(null);
    setSearchText("");
  };
  
  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Tabs 
            defaultValue="all" 
            value={activeView}
            onValueChange={(value) => setActiveView(value as "all" | "assigned")}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={() => navigate("/new-order")}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> New Order
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Department filter */}
            <Select 
              value={selectedDepartment || ""} 
              onValueChange={(val) => setSelectedDepartment(val as Department || null)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Department</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Payment filter */}
            <Select 
              value={selectedPayment || ""} 
              onValueChange={(val) => setSelectedPayment(val as PaymentStatus || null)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Payment</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payments</SelectItem>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Clear filters button */}
            {(selectedStatus || selectedDepartment || selectedPayment || searchText) && (
              <Button
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <OrdersList orders={filteredOrders} currentUser={currentUser} getTabStatus={getTabStatus} />
    </div>
  );
};

export default Orders;
