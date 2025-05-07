
import React, { useState, useEffect } from "react";
import DashboardApprovalSection from "@/components/DashboardApprovalSection";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import StatusSummaryCard from "@/components/StatusSummaryCard";
import RecentOrdersList from "@/components/RecentOrdersList";
import FinancialOverviewCard from "@/components/FinancialOverviewCard";
import TaskListCard from "@/components/TaskListCard";
import DashboardElement from "@/components/DashboardElement";
import OrderStatusTabs from "@/components/OrderStatusTabs";
import OrderGrid from "@/components/OrderGrid";
import RoleBasedSliderMenu from "@/components/RoleBasedSliderMenu";
import { Order } from "@/types";

const Dashboard = () => {
  const { currentUser, orders } = useOrders();
  const [activeStatus, setActiveStatus] = useState("All");
  
  useEffect(() => {
    document.title = "Dashboard | Chhapai Order Management";
  }, []);

  // Get orders based on user department and filter by status
  const getDepartmentOrders = () => {
    if (!currentUser) return [];
    
    // Filter by department (Admin sees all)
    const departmentOrders = currentUser.role === "Admin" 
      ? orders 
      : orders.filter(order => 
          order.currentDepartment === currentUser.department || 
          (currentUser.department === "Sales" && ["Prepress", "Design"].includes(order.currentDepartment))
        );
    
    // Filter by active status tab
    if (activeStatus !== "All") {
      return departmentOrders.filter(order => order.status === activeStatus);
    }
    
    return departmentOrders;
  };

  // Count orders by status
  const getOrderCountByStatus = () => {
    const departmentOrders = getDepartmentOrders();
    const counts = { All: departmentOrders.length };
    
    departmentOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    return counts;
  };

  // Get filtered orders
  const filteredOrders = getDepartmentOrders();
  const orderCounts = getOrderCountByStatus();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {currentUser.name}
          </p>
        </div>
        
        {/* Only show these buttons for Sales and Admin */}
        {(currentUser.department === "Sales" || currentUser.role === "Admin") && (
          <div className="flex items-center gap-2">
            <Link to="/new-order">
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                New Order
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button size="sm" variant="outline" className="h-9 gap-1">
                <BarChart className="h-4 w-4" />
                Reports
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status summary */}
        <DashboardElement elementId="statusSummary">
          <StatusSummaryCard />
        </DashboardElement>
        
        {/* Financial summary - only for Sales and Admin */}
        <DashboardElement elementId="financialSummary">
          <FinancialOverviewCard />
        </DashboardElement>
        
        {/* Role-based slider menu */}
        <DashboardElement elementId="sliderMenu">
          <RoleBasedSliderMenu />
        </DashboardElement>
      </div>
      
      {/* Approvals section */}
      <div className="mb-8">
        <DashboardElement elementId="orderApprovals">
          <DashboardApprovalSection />
        </DashboardElement>
      </div>
      
      {/* Order Status Tabs and Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Orders Overview
          </h2>
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>
        
        <OrderStatusTabs 
          activeStatus={activeStatus}
          onChange={setActiveStatus}
          countByStatus={orderCounts}
        />
        
        <OrderGrid orders={filteredOrders} />
      </div>
      
      {/* Task list moved to bottom for better layout */}
      <div className="mt-8">
        <DashboardElement elementId="taskList">
          <TaskListCard />
        </DashboardElement>
      </div>
    </div>
  );
};

export default Dashboard;
