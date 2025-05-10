
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, CheckCircle, AlertTriangle, Package, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProductionDashboard: React.FC = () => {
  const { orders, currentUser, addStatusUpdate, markReadyForDispatch } = useOrders();
  const [activeTab, setActiveTab] = useState('in-production');
  const navigate = useNavigate();
  
  // Filter orders by production status
  const inProductionOrders = orders.filter(order => 
    order.currentDepartment === 'Production' && order.status === 'In Progress'
  );
  
  const readyToDispatchOrders = orders.filter(order => 
    order.status === 'Ready to Dispatch' && 
    order.paymentStatus === 'Paid'
  );
  
  const awaitingPaymentOrders = orders.filter(order => 
    order.currentDepartment === 'Production' && 
    (order.status === 'Ready to Dispatch' || order.status === 'Completed') &&
    order.paymentStatus !== 'Paid'
  );
  
  const dispatchedOrders = orders.filter(order => 
    order.status === 'Dispatched'
  );

  // Mark order as ready to dispatch
  const handleMarkReadyToDispatch = async (orderId: string) => {
    try {
      await markReadyForDispatch(orderId);
    } catch (error) {
      console.error("Error marking as ready to dispatch:", error);
    }
  };

  // Set estimated timeline
  const handleSetEstimatedTime = (orderId: string) => {
    // This would open a modal to set the time
    navigate(`/orders/${orderId}?action=set-timeline`);
  };

  // Enter tracking info
  const handleEnterTrackingInfo = (orderId: string) => {
    navigate(`/orders/${orderId}?action=add-tracking`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Team Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage production queue, dispatch, and delivery tracking
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => navigate('/orders')}>
            <Package className="h-4 w-4" />
            View Production Queue
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="in-production">
            In Production <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{inProductionOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="awaiting-payment">
            Awaiting Payment <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{awaitingPaymentOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="ready-to-dispatch">
            Ready to Dispatch <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{readyToDispatchOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="dispatched">
            Dispatched <span className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">{dispatchedOrders.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="in-production" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProductionOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders currently in production</p>
                </CardContent>
              </Card>
            ) : (
              inProductionOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">
                          <Calendar className="inline mr-1 h-4 w-4" />
                          ETA: {order.expectedCompletionDate || 'Not set'}
                        </p>
                        <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'outline'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        {order.productionStages?.map((stage, index) => (
                          <Badge 
                            key={index} 
                            variant={stage.status === 'completed' ? 'default' : 'outline'}
                            className="mr-1 mb-1"
                          >
                            {stage.stage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetEstimatedTime(order.id)}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Set Timeline
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleMarkReadyToDispatch(order.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark Ready
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="awaiting-payment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awaitingPaymentOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders awaiting payment</p>
                </CardContent>
              </Card>
            ) : (
              awaitingPaymentOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2 border-b">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status="Pending Payment" />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p>₹{order.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Paid Amount</p>
                          <p>₹{order.paidAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pending</p>
                          <p>₹{order.pendingAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant="outline" className="mt-1">{order.paymentStatus}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ready-to-dispatch" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyToDispatchOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No orders ready to dispatch</p>
                </CardContent>
              </Card>
            ) : (
              readyToDispatchOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <Badge variant="default" className="bg-green-500">Paid</Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {order.deliveryAddress ? 
                            order.deliveryAddress.substring(0, 50) + (order.deliveryAddress.length > 50 ? '...' : '') : 
                            'No delivery address'}
                        </p>
                      </div>
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
                        onClick={() => handleEnterTrackingInfo(order.id)}
                      >
                        <Truck className="mr-1 h-4 w-4" />
                        Add Tracking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="dispatched" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispatchedOrders.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No recently dispatched orders</p>
                </CardContent>
              </Card>
            ) : (
              dispatchedOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm flex items-center mb-1">
                        <Truck className="h-4 w-4 mr-1" />
                        Courier: {order.dispatchDetails?.courierPartner || 'Not specified'}
                      </p>
                      <p className="text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Tracking: {order.dispatchDetails?.trackingNumber || 'Not available'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Approval Requests Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'Pending Approval' && o.pendingApprovalFrom === 'Sales').length === 0 ? (
              <p className="text-muted-foreground">No pending approvals from Sales team</p>
            ) : (
              orders
                .filter(o => o.status === 'Pending Approval' && o.pendingApprovalFrom === 'Sales')
                .map(order => (
                  <div key={order.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.orderNumber} - {order.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.approvalReason || 'Waiting for Sales approval'}
                        </p>
                      </div>
                      <StatusBadge status="Pending Approval" />
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionDashboard;
