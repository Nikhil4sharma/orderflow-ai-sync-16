
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

const Orders: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const navigate = useNavigate();
  
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentStatus | null>(null);
  const [activeView, setActiveView] = useState<"all" | "assigned">("all");
  
  // Filter orders based on department access and search text
  const filteredOrders = orders.filter(order => {
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
        
        <div className="flex overflow-x-auto gap-2 pb-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={(selectedStatus === status) || (status === "All" && selectedStatus === null) ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setSelectedStatus(status === "All" ? null : status)}
            >
              {status}
              {status === "All" ? (
                <span className="ml-2 bg-primary-foreground text-primary rounded-full h-6 min-w-6 flex items-center justify-center px-1.5 text-xs">
                  {getStatusCount("All")}
                </span>
              ) : (
                <span className="ml-2 bg-primary-foreground text-primary rounded-full h-6 min-w-6 flex items-center justify-center px-1.5 text-xs">
                  {getStatusCount(status)}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground text-center mt-2">
              {searchText || selectedStatus || selectedDepartment || selectedPayment ? 
                "Try a different search term or filter" : 
                "There are no orders to display"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="w-full hover:shadow-md transition-shadow border-l-4" style={{
              borderLeftColor: order.currentDepartment === 'Design' ? '#3b82f6' : 
                             order.currentDepartment === 'Prepress' ? '#8b5cf6' : 
                             order.currentDepartment === 'Production' ? '#f59e0b' : 
                             order.currentDepartment === 'Sales' ? '#10b981' : '#6b7280'
            }}>
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
                    <span className="text-muted-foreground">Payment</span>
                    <p className={
                      order.paymentStatus === 'Paid' ? 'text-green-600' :
                      order.paymentStatus === 'Not Paid' ? 'text-red-600' :
                      'text-amber-600'
                    }>{order.paymentStatus}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created</span>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
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

export default Orders;
