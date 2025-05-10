
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardApprovalSection from "@/components/DashboardApprovalSection";
import { useUsers } from "@/contexts/UserContext";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, FileText, Clipboard, LayoutDashboard, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";
import StatusSummaryCard from "@/components/StatusSummaryCard";
import FinancialOverviewCard from "@/components/FinancialOverviewCard";
import TaskListCard from "@/components/TaskListCard";
import DashboardElement from "@/components/DashboardElement";
import RoleBasedSliderMenu from "@/components/RoleBasedSliderMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { currentUser, loading } = useUsers();
  const { orders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to department-specific dashboard if user has a department
    if (currentUser && !loading) {
      switch (currentUser.department) {
        case 'Sales':
          navigate('/sales');
          break;
        case 'Design':
          navigate('/design');
          break;
        case 'Prepress':
          navigate('/prepress');
          break;
        case 'Production':
          navigate('/production');
          break;
        // Admin stays on this generic dashboard
        default:
          // No redirect for Admin
          break;
      }
    }
  }, [currentUser, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        
        <Skeleton className="h-64 w-full mb-8" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  // Admin Dashboard only, other roles are redirected
  if (currentUser?.role !== 'Admin') {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status summary */}
        <DashboardElement elementId="statusSummary">
          <StatusSummaryCard />
        </DashboardElement>
        
        {/* Financial summary */}
        <DashboardElement elementId="financialSummary">
          <FinancialOverviewCard />
        </DashboardElement>
        
        {/* Role-based slider menu */}
        <DashboardElement elementId="recentOrders">
          <RoleBasedSliderMenu />
        </DashboardElement>
      </div>
      
      {/* Approvals section */}
      <div className="mb-8">
        <DashboardElement elementId="orderApprovals">
          <DashboardApprovalSection />
        </DashboardElement>
      </div>
      
      {/* Department sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Clipboard className="mr-2 h-5 w-5" />
              Design Department
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">Active Design Tasks</p>
                <p className="text-2xl font-bold">{orders.filter(order => order.currentDepartment === 'Design').length}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/design')}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Prepress Department
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">Active Prepress Tasks</p>
                <p className="text-2xl font-bold">{orders.filter(order => order.currentDepartment === 'Prepress').length}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/prepress')}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Production Department
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">Active Production Orders</p>
                <p className="text-2xl font-bold">{orders.filter(order => order.currentDepartment === 'Production').length}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/production')}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Sales Department
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">Active Sales Orders</p>
                <p className="text-2xl font-bold">{orders.filter(order => order.currentDepartment === 'Sales').length}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/sales')}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
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
