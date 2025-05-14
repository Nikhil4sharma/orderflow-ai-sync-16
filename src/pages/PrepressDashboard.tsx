
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types';

const PrepressDashboard = () => {
  const { orders, updateOrder, currentUser, addStatusUpdate } = useOrders();
  const { hasPermission } = useUsers();
  const [activeTab, setActiveTab] = useState<string>('new');

  // Filter orders assigned to Prepress department
  const prepressOrders = orders.filter(
    (order) => order.currentDepartment === 'Prepress'
  );

  // Split prepress orders by status
  const newPrepressOrders = prepressOrders.filter(
    (order) => !order.prepressStatus || order.prepressStatus === 'Waiting for approval'
  );
  
  const inProgressPrepressOrders = prepressOrders.filter(
    (order) => order.prepressStatus === 'Working on it'
  );
  
  const completedPrepressOrders = prepressOrders.filter(
    (order) => order.prepressStatus === 'Forwarded to production'
  );
  
  const handleStartWorking = async (order: Order) => {
    try {
      // Update order status
      const updatedOrder = {
        ...order,
        status: 'In Progress' as OrderStatus,
        prepressStatus: 'Working on it',
        lastUpdated: new Date().toISOString(),
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        department: currentUser?.department || 'Prepress',
        status: 'In Progress' as OrderStatus,
        remarks: 'Started working on prepress'
      });
      
      toast.success('Started working on prepress');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };
  
  const handleForwardToProduction = async (order: Order) => {
    try {
      // Update order status
      const updatedOrder = {
        ...order,
        status: 'Forwarded to Production' as unknown as OrderStatus,
        prepressStatus: 'Forwarded to production',
        currentDepartment: 'Production',
        lastUpdated: new Date().toISOString(),
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        department: currentUser?.department || 'Prepress',
        status: 'Forwarded to Production' as unknown as OrderStatus,
        remarks: 'Prepress completed and forwarded to production'
      });
      
      toast.success('Forwarded to production');
    } catch (error) {
      toast.error('Failed to forward to production');
      console.error(error);
    }
  };
  
  const handleRequestApproval = async (order: Order) => {
    try {
      // Update order status
      const updatedOrder = {
        ...order,
        status: 'Approval Requested' as unknown as OrderStatus,
        pendingApprovalFrom: 'Sales',
        approvalReason: 'Prepress approval needed',
        lastUpdated: new Date().toISOString(),
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        department: currentUser?.department || 'Prepress',
        status: 'Approval Requested' as unknown as OrderStatus,
        remarks: 'Requesting approval for prepress work'
      });
      
      toast.success('Approval requested from Sales team');
    } catch (error) {
      toast.error('Failed to request approval');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prepress Dashboard</h1>
      
      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">
            New <Badge className="ml-2">{newPrepressOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress <Badge className="ml-2">{inProgressPrepressOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge className="ml-2">{completedPrepressOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          {newPrepressOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newPrepressOrders.map((order) => (
                <PrepressCard 
                  key={order.id}
                  order={order}
                  onStartWorking={() => handleStartWorking(order)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No new prepress tasks available
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="inProgress" className="mt-6">
          {inProgressPrepressOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressPrepressOrders.map((order) => (
                <PrepressCard 
                  key={order.id}
                  order={order}
                  inProgress
                  onForwardToProduction={() => handleForwardToProduction(order)}
                  onRequestApproval={() => handleRequestApproval(order)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No in-progress prepress tasks
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedPrepressOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedPrepressOrders.map((order) => (
                <PrepressCard 
                  key={order.id}
                  order={order}
                  completed
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No completed prepress tasks
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PrepressCardProps {
  order: Order;
  inProgress?: boolean;
  completed?: boolean;
  onStartWorking?: () => void;
  onForwardToProduction?: () => void;
  onRequestApproval?: () => void;
}

const PrepressCard: React.FC<PrepressCardProps> = ({
  order,
  inProgress,
  completed,
  onStartWorking,
  onForwardToProduction,
  onRequestApproval
}) => {
  const [remarks, setRemarks] = useState('');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{order.orderNumber}</CardTitle>
        <p className="text-sm text-muted-foreground">{order.clientName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p><strong>Items:</strong> {order.items.join(', ')}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {order.prepressRemarks && (
            <p><strong>Prepress Notes:</strong> {order.prepressRemarks}</p>
          )}
          
          {!inProgress && !completed && onStartWorking && (
            <Button 
              onClick={onStartWorking}
              className="w-full"
              variant="default"
            >
              Start Working
            </Button>
          )}
          
          {inProgress && (
            <div className="space-y-4">
              <textarea
                placeholder="Add remarks"
                className="w-full border rounded p-2 h-24"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div className="flex space-x-2">
                {onForwardToProduction && (
                  <Button 
                    onClick={onForwardToProduction}
                    className="flex-1"
                    variant="default"
                  >
                    Forward to Production
                  </Button>
                )}
                {onRequestApproval && (
                  <Button 
                    onClick={onRequestApproval}
                    className="flex-1"
                    variant="outline"
                  >
                    Request Approval
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrepressDashboard;
