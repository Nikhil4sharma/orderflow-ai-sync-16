
import React, { useState, useEffect } from "react";
import { useOrders } from "@/contexts/OrderContext";
import OrderCard from "@/components/OrderCard";
import OrderFilters from "@/components/OrderFilters";
import { Button } from "@/components/ui/button";
import { Department } from "@/types";
import { SearchIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { orders, filterOrdersByDepartment, filterOrdersByStatus, currentUser } = useOrders();
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Set initial department filter based on user's department
  useEffect(() => {
    if (currentUser && currentUser.department) {
      setDepartmentFilter(currentUser.department);
    }
  }, [currentUser]);

  // Filter orders based on filters and search
  const filteredOrders = filterOrdersByDepartment(departmentFilter)
    .filter(order => statusFilter === 'All' ? true : order.status === statusFilter)
    .filter(order => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(search) ||
        order.clientName.toLowerCase().includes(search) ||
        order.items.some(item => item.toLowerCase().includes(search))
      );
    });

  // Only show orders for the user's department unless they're an admin
  const userCanSeeAllDepartments = currentUser.role === 'Admin';
  const visibleOrders = userCanSeeAllDepartments
    ? filteredOrders
    : filteredOrders.filter(order => order.currentDepartment === currentUser.department);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">OrderFlow Dashboard</h1>
          <p className="text-muted-foreground">
            {visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>
        {/* Only show New Order button for Sales team and Admins */}
        {(currentUser.department === 'Sales' || currentUser.role === 'Admin') && (
          <Button 
            className="mt-4 sm:mt-0" 
            onClick={() => navigate('/new-order')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Order
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by number, client, or items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <OrderFilters
        departmentFilter={departmentFilter}
        statusFilter={statusFilter}
        onDepartmentChange={setDepartmentFilter}
        onStatusChange={setStatusFilter}
        disableDepartmentFilter={!userCanSeeAllDepartments}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {visibleOrders.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No orders found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
