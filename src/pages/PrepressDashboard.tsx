
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, AlertCircle, Clock, FileCheck } from 'lucide-react';

const PrepressDashboard: React.FC = () => {
  const { orders, currentUser, addStatusUpdate } = useOrders();
  const [activeTab, setActiveTab] = useState('assigned');
  const navigate = useNavigate();
  
  // Filter orders for Prepress department
  const prepressOrders = orders.filter(order => 
    order.currentDepartment === 'Prepress' ||
    (order.prepressStatus && ['Working on it', 'Waiting for approval'].includes(order.prepressStatus))
  );
  
  // Orders waiting for Sales approval
  const pendingApprovalOrders = orders.filter(order => 
    order.prepressStatus === 'Waiting for approval' || 
    (order.statusHistory?.some(update => 
      update.department === 'Prepress' && update.status.includes('Approval Requested')
    ))
  );
  
  // Orders ready to forward to Production
  const readyToForwardOrders = orders.filter(order => 
    order.currentDepartment === 'Prepress' && 
    order.statusHistory?.some(update => 
      update.status.includes('Prepress Approved') || 
      (update.department === 'Sales' && update.status.includes('Approved'))
    )
  );

  // Forward to Production
  const handleForwardToProduction = async (orderId: string) => {
    try {
      await addStatusUpdate(orderId, {
        status: 'Forwarded to Production',
        department: 'Production',
        remarks: 'Prepress completed and forwarded to Production'
      });
    } catch (error) {
      console.error("Error forwarding to production:", error);
    }
  };

  // Request approval from Sales
  const handleRequestApproval = async (orderId: string) => {
    try {
      await addStatusUpdate(orderId, {
        status: 'Approval Requested',
        remarks: 'Prepress completed, waiting for Sales approval'
      });
    } catch (error) {
      console.error("Error requesting approval:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prepress Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage prepress activities, approvals, and production forwarding
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Upload className="h-4 w-4" />
            Upload Prepress Files
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="assigned">
            Assigned Orders <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{prepressOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="pending-approval">
            Pending Approval <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{pendingApprovalOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="ready-to-forward">
            Ready for Production <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{readyToForwardOrders.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prepressOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No assigned orders at the moment</p>
                </CardContent>
              </Card>
            ) : (
              prepressOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status={order.prepressStatus || order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm mb-1">
                        <Clock className="inline mr-1 h-4 w-4" />
                        Received: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-3 line-clamp-2">
                        {order.prepressRemarks || 'No specific prepress requirements provided.'}
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
                  <p className="text-muted-foreground">No orders ready for production</p>
                </CardContent>
              </Card>
            ) : (
              readyToForwardOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Prepress Approved" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm mb-3">
                        <CheckCircle className="inline mr-1 h-4 w-4 text-green-500" />
                        Prepress approved by Sales team
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
                        onClick={() => handleForwardToProduction(order.id)}
                      >
                        <Send className="mr-1 h-4 w-4" />
                        Forward to Production
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">File Upload Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <FileCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Upload Production-Ready Files</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files here or click to select files
              </p>
              <Button variant="outline">Select Files</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sales Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovalOrders.length === 0 ? (
                <p className="text-muted-foreground">No feedback to display</p>
              ) : (
                pendingApprovalOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="p-3 rounded-md border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${order.id}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrepressDashboard;
