
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle, AlertCircle, Clock, CreditCard, FileText, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SalesDashboard: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  // Filter orders for different tabs
  const pendingDesignApprovalOrders = orders.filter(order => 
    order.designStatus === 'Pending Feedback from Sales Team' || 
    (order.statusHistory?.some(update => 
      update.department === 'Design' && update.status.includes('Approval Requested')
    ))
  );
  
  const pendingPrepressApprovalOrders = orders.filter(order => 
    order.prepressStatus === 'Waiting for approval' || 
    (order.statusHistory?.some(update => 
      update.department === 'Prepress' && update.status.includes('Approval Requested')
    ))
  );
  
  const pendingPaymentOrders = orders.filter(order => 
    (order.status === 'Ready to Dispatch' || order.status === 'Completed') && 
    order.paymentStatus !== 'Paid'
  );
  
  const dispatchReadyOrders = orders.filter(order => 
    order.status === 'Ready to Dispatch' && 
    order.paymentStatus === 'Paid'
  );

  // Calculate financial metrics
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalPaid = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const totalPending = orders.reduce((sum, order) => sum + order.pendingAmount, 0);
  
  // Count orders by status
  const countByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  // Count orders by department
  const countByDepartment = orders.reduce((acc, order) => {
    acc[order.currentDepartment] = (acc[order.currentDepartment] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage approvals, payments, and order workflows
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 gap-1" onClick={() => navigate('/new-order')}>
            <PlusCircle className="h-4 w-4" />
            New Order
          </Button>
          <Button size="sm" variant="outline" className="h-9 gap-1" onClick={() => navigate('/admin/reports')}>
            <BarChart className="h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From all orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Amount Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPaid / totalAmount) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Amount Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPending / totalAmount) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="design-approval">
            Design Approvals <Badge className="ml-1">{pendingDesignApprovalOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="prepress-approval">
            Prepress Approvals <Badge className="ml-1">{pendingPrepressApprovalOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending-payment">
            Pending Payments <Badge className="ml-1">{pendingPaymentOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready-dispatch">
            Ready to Dispatch <Badge className="ml-1">{dispatchReadyOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            All Orders <Badge className="ml-1">{orders.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="design-approval" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDesignApprovalOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No design approvals pending</p>
                </CardContent>
              </Card>
            ) : (
              pendingDesignApprovalOrders.map(order => (
                <Card key={order.id} className="overflow-hidden border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Pending Approval" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                        Design waiting for your approval
                      </p>
                      <p className="text-sm line-clamp-2">
                        {order.designRemarks || 'No specific remarks provided'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="prepress-approval" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPrepressApprovalOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No prepress approvals pending</p>
                </CardContent>
              </Card>
            ) : (
              pendingPrepressApprovalOrders.map(order => (
                <Card key={order.id} className="overflow-hidden border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Pending Approval" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                        Prepress waiting for your approval
                      </p>
                      <p className="text-sm line-clamp-2">
                        {order.prepressRemarks || 'No specific remarks provided'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        Request Changes
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending-payment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPaymentOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders pending payment</p>
                </CardContent>
              </Card>
            ) : (
              pendingPaymentOrders.map(order => (
                <Card key={order.id} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <Badge variant={order.paymentStatus === 'Not Paid' ? 'destructive' : 'outline'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p>₹{order.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pending</p>
                          <p className="text-amber-600 font-medium">₹{order.pendingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        Details
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                      >
                        <CreditCard className="mr-1 h-4 w-4" />
                        Record Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ready-dispatch" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispatchReadyOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders ready for dispatch</p>
                </CardContent>
              </Card>
            ) : (
              dispatchReadyOrders.map(order => (
                <Card key={order.id} className="overflow-hidden border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Ready to Dispatch" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Badge variant="default" className="bg-green-500 mb-2">Payment Confirmed</Badge>
                      <p className="text-sm">
                        Ready for dispatch approval
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Details
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve Dispatch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Order #</th>
                      <th className="text-left p-2">Client</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Payment</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="p-2">{order.orderNumber}</td>
                        <td className="p-2">{order.clientName}</td>
                        <td className="p-2">₹{order.amount.toLocaleString()}</td>
                        <td className="p-2">{order.currentDepartment}</td>
                        <td className="p-2"><StatusBadge status={order.status} /></td>
                        <td className="p-2">{order.paymentStatus}</td>
                        <td className="p-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/orders')}
                >
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order ETA Overview</CardTitle>
            <CardDescription>Expected completion times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .filter(o => o.expectedCompletionDate)
                .slice(0, 5)
                .map(order => (
                  <div key={order.id} className="flex justify-between items-center p-2 rounded-md border">
                    <div>
                      <p className="font-medium">{order.orderNumber} - {order.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.currentDepartment} | {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        <Clock className="inline mr-1 h-4 w-4" />
                        {new Date(order.expectedCompletionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              {orders.filter(o => o.expectedCompletionDate).length === 0 && (
                <p className="text-muted-foreground text-center py-4">No ETAs set for any orders</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Management</CardTitle>
            <CardDescription>Track and manage payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPaymentOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-2 rounded-md border">
                  <div>
                    <p className="font-medium">{order.orderNumber} - {order.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{order.amount.toLocaleString()} | Pending: ₹{order.pendingAmount.toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <CreditCard className="mr-1 h-4 w-4" />
                    Update
                  </Button>
                </div>
              ))}
              {pendingPaymentOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No pending payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;
