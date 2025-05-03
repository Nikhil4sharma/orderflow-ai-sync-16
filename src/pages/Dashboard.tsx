
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import OrderCard from "@/components/OrderCard";
import OrderFilters from "@/components/OrderFilters";
import { Button } from "@/components/ui/button";
import { Department } from "@/types";
import { SearchIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { orders, filterOrdersByDepartment, filterOrdersByStatus } = useOrders();
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">OrderFlow Dashboard</h1>
          <p className="text-muted-foreground">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0" 
          onClick={() => navigate('/new-order')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Order
        </Button>
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
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No orders found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
