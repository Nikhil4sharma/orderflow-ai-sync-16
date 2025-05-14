
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ProductionDashboard = () => {
  const { orders, updateOrder, markReadyForDispatch } = useOrders();
  const [loading, setLoading] = useState<string | null>(null);

  // Filter only production orders
  const productionOrders = orders.filter(order => order.currentDepartment === 'Production');
  
  // Group by status
  const inProgressOrders = productionOrders.filter(order => order.status === 'In Progress');
  const onHoldOrders = productionOrders.filter(order => order.status === 'On Hold');
  const completedOrders = productionOrders.filter(order => order.status === 'Completed' || order.status === 'Ready to Dispatch');

  // Handle marking an order as ready for dispatch
  const handleMarkReadyForDispatch = async (orderId: string) => {
    setLoading(orderId);
    try {
      await markReadyForDispatch(orderId);
      toast.success('Order marked as ready for dispatch');
    } catch (error) {
      toast.error('Failed to mark order as ready for dispatch');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Production Dashboard</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">In Progress 
          <Badge variant="default" className="ml-2">{inProgressOrders.length}</Badge>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgressOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{order.clientName}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Items:</strong> {order.items.join(', ')}</p>
                  <p className="text-sm"><strong>Status:</strong> {order.status}</p>
                  
                  <Button 
                    onClick={() => handleMarkReadyForDispatch(order.id)}
                    className="w-full mt-2"
                    disabled={loading === order.id}
                  >
                    {loading === order.id ? 'Processing...' : 'Mark Ready for Dispatch'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {inProgressOrders.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No orders currently in production
            </p>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">On Hold
          <Badge variant="secondary" className="ml-2">{onHoldOrders.length}</Badge>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onHoldOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{order.clientName}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Items:</strong> {order.items.join(', ')}</p>
                <p className="text-sm"><strong>Status:</strong> {order.status}</p>
              </CardContent>
            </Card>
          ))}
          
          {onHoldOrders.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No orders on hold
            </p>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Ready/Completed
          <Badge variant="outline" className="ml-2">{completedOrders.length}</Badge>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{order.clientName}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Items:</strong> {order.items.join(', ')}</p>
                <p className="text-sm"><strong>Status:</strong> {order.status}</p>
              </CardContent>
            </Card>
          ))}
          
          {completedOrders.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No completed orders
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductionDashboard;
