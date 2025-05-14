
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { OrderStatus } from '@/types';

const DesignDashboard: React.FC = () => {
  const { orders, currentUser, addStatusUpdate } = useOrders();
  const [activeTab, setActiveTab] = useState('assigned');
  const navigate = useNavigate();
  
  // Filter orders for the Design department
  const designOrders = orders.filter(order => 
    order.currentDepartment === 'Design' || 
    (order.designStatus && ['Working on it', 'Pending Feedback from Sales Team'].includes(order.designStatus))
  );
  
  // Pending approval orders (waiting for feedback from Sales)
  const pendingApprovalOrders = orders.filter(order => 
    order.designStatus === 'Pending Feedback from Sales Team' || 
    (order.statusHistory?.some(update => 
      update.department === 'Design' && update.status.includes('Pending Approval')
    ))
  );
  
  // Ready to forward to Prepress orders
  const readyToForwardOrders = orders.filter(order => 
    order.currentDepartment === 'Design' && 
    order.statusHistory?.some(update => 
      update.status === 'Design Approved' || update.status === 'Approved'
    )
  );

  // Forward design to Prepress
  const handleForwardToPrepress = async (orderId: string) => {
    try {
      await addStatusUpdate(orderId, {
        status: 'In Progress' as OrderStatus,
        department: 'Prepress',
        remarks: 'Design completed and forwarded to Prepress'
      });
    } catch (error) {
      console.error("Error forwarding to prepress:", error);
    }
  };

  // Request approval from Sales
  const handleRequestApproval = async (orderId: string) => {
    try {
      await addStatusUpdate(orderId, {
        status: 'Pending Approval' as OrderStatus,
        remarks: 'Design completed, waiting for Sales approval'
      });
    } catch (error) {
      console.error("Error requesting approval:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage designs, approvals, and prepress forwarding
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Upload className="h-4 w-4" />
            Upload Design
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="assigned">
            Assigned Orders <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{designOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="pending-approval">
            Pending Approval <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{pendingApprovalOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="ready-to-forward">
            Ready to Forward <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{readyToForwardOrders.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No assigned orders at the moment</p>
                </CardContent>
              </Card>
            ) : (
              designOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status={order.designStatus || order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm mb-1">
                        <Clock className="inline mr-1 h-4 w-4" />
                        Created: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-3 line-clamp-2">
                        {order.designRemarks || 'No specific design requirements provided.'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRequestApproval(order.id)}
                      >
                        <Send className="mr-1 h-4 w-4" />
                        Request Approval
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending-approval" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingApprovalOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders pending approval</p>
                </CardContent>
              </Card>
            ) : (
              pendingApprovalOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Pending Approval" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm mb-3">
                        <AlertCircle className="inline mr-1 h-4 w-4" />
                        Waiting for Sales team feedback
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ready-to-forward" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyToForwardOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders ready to forward to Prepress</p>
                </CardContent>
              </Card>
            ) : (
              readyToForwardOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Design Approved" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm mb-3">
                        <CheckCircle className="inline mr-1 h-4 w-4 text-green-500" />
                        Design approved by Sales team
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleForwardToPrepress(order.id)}
                      >
                        <Send className="mr-1 h-4 w-4" />
                        Forward to Prepress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {designOrders.length === 0 ? (
              <p className="text-muted-foreground">No active designs to show timeline</p>
            ) : (
              designOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-2 rounded-md border">
                  <div>
                    <p className="font-medium">{order.orderNumber} - {order.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.designTimeline || 'Timeline not set'}
                    </p>
                  </div>
                  <StatusBadge status={order.designStatus || order.status} />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignDashboard;
