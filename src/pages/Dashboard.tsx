
import React, { useState, useEffect } from "react";
import DashboardApprovalSection from "@/components/DashboardApprovalSection";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import StatusSummaryCard from "@/components/StatusSummaryCard";
import RecentOrdersList from "@/components/RecentOrdersList";
import FinancialOverviewCard from "@/components/FinancialOverviewCard";
import TaskListCard from "@/components/TaskListCard";
import DashboardElement from "@/components/DashboardElement";

const Dashboard = () => {
  const { currentUser } = useOrders();
  
  useEffect(() => {
    document.title = "Dashboard | Chhapai Order Management";
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals section - left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order approvals */}
          <DashboardElement elementId="orderApprovals">
            <DashboardApprovalSection />
          </DashboardElement>
          
          {/* Status summary */}
          <DashboardElement elementId="statusSummary">
            <StatusSummaryCard />
          </DashboardElement>
          
          {/* Recent orders */}
          <DashboardElement elementId="recentOrders">
            <RecentOrdersList />
          </DashboardElement>
        </div>
        
        {/* Sidebar - right column */}
        <div className="space-y-6">
          {/* Financial summary - only for Sales and Admin */}
          <DashboardElement elementId="financialSummary">
            <FinancialOverviewCard />
          </DashboardElement>
          
          {/* Task list */}
          <DashboardElement elementId="taskList">
            <TaskListCard />
          </DashboardElement>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
