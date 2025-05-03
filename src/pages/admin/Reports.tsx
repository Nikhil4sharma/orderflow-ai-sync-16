
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, PieChart, LineChart, Clipboard } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderStatusPieChart } from "@/components/admin/OrderStatusPieChart";
import { DepartmentWorkloadChart } from "@/components/admin/DepartmentWorkloadChart";
import { PaymentStatusChart } from "@/components/admin/PaymentStatusChart";
import { OrdersTable } from "@/components/admin/OrdersTable";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { orders, currentUser } = useOrders();

  // Check if current user is admin
  if (currentUser?.role !== "Admin") {
    navigate("/");
    return null;
  }

  // Calculate key metrics
  const totalOrders = orders.length;
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.amount, 0), [orders]);
  const paidAmount = useMemo(() => orders.reduce((sum, order) => sum + order.paidAmount, 0), [orders]);
  const pendingAmount = useMemo(() => orders.reduce((sum, order) => sum + order.pendingAmount, 0), [orders]);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      "New": 0,
      "In Progress": 0,
      "Completed": 0,
      "On Hold": 0,
      "Issue": 0
    };
    
    orders.forEach(order => {
      counts[order.status]++;
    });
    
    return counts;
  }, [orders]);
  
  // Calculate payment status
  const paymentStatusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = {
      "Not Paid": 0,
      "Partially Paid": 0,
      "Paid": 0
    };
    
    orders.forEach(order => {
      counts[order.paymentStatus]++;
    });
    
    return counts;
  }, [orders]);

  // Calculate department workload
  const departmentWorkload = useMemo(() => {
    const counts: Record<string, number> = {
      "Sales": 0,
      "Production": 0,
      "Design": 0,
      "Prepress": 0
    };
    
    orders.forEach(order => {
      counts[order.currentDepartment]++;
    });
    
    return counts;
  }, [orders]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button variant="outline" onClick={() => window.print()}>
          <Clipboard className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">${totalRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payments</CardDescription>
            <CardTitle className="text-3xl text-amber-500">${pendingAmount.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle className="text-3xl">${averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders">
            <LineChart className="h-4 w-4 mr-2" />
            Order Analytics
          </TabsTrigger>
          <TabsTrigger value="departments">
            <PieChart className="h-4 w-4 mr-2" />
            Department Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart orders={orders} height={350} />
              </CardContent>
            </Card>
            
            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <OrderStatusPieChart data={statusCounts} />
              </CardContent>
            </Card>
            
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Payment status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PaymentStatusChart data={paymentStatusCounts} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Analytics</CardTitle>
              <CardDescription>Detailed breakdown of all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={orders} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Workload</CardTitle>
              <CardDescription>Current workload across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentWorkloadChart data={departmentWorkload} height={400} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
