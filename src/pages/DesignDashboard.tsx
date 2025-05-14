
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types';

const DesignDashboard = () => {
  const { orders, updateOrder, currentUser, addStatusUpdate } = useOrders();
  const { hasPermission } = useUsers();
  const [activeTab, setActiveTab] = useState<string>('new');

  // Filter orders assigned to Design department
  const designOrders = orders.filter(
    (order) => order.currentDepartment === 'Design'
  );

  // Split design orders by status
  const newDesignOrders = designOrders.filter(
    (order) => 
      !['Design Approved', 'Approved', 'Forwarded to Prepress'].includes(order.status)
  );
  
  const completedDesignOrders = designOrders.filter(
    (order) => 
      ['Design Approved', 'Approved', 'Forwarded to Prepress'].includes(order.status as string)
  );
  
  const handleUpdateDesignStatus = async (
    order: Order, 
    status: OrderStatus, 
    remarks: string
  ) => {
    try {
      // Update order status
      const updatedOrder = {
        ...order,
        status: status,
        designStatus: 'Forwarded to Prepress',
        lastUpdated: new Date().toISOString(),
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        department: currentUser?.department ?? 'Design',
        status: status,
        remarks: remarks
      });
      
      toast.success(`Design ${status === 'Design Approved' ? 'approved' : 'rejected'}`);
    } catch (error) {
      toast.error('Failed to update design status');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Design Dashboard</h1>
      
      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">
            New Designs <Badge className="ml-2">{newDesignOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge className="ml-2">{completedDesignOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          {newDesignOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newDesignOrders.map((order) => (
                <DesignCard 
                  key={order.id}
                  order={order}
                  onApprove={(remarks) => handleUpdateDesignStatus(order, 'Design Approved' as OrderStatus, remarks)}
                  onReject={(remarks) => handleUpdateDesignStatus(order, 'Design Rejected' as OrderStatus, remarks)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No new design tasks available
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedDesignOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedDesignOrders.map((order) => (
                <DesignCard 
                  key={order.id}
                  order={order}
                  completed
                  onApprove={() => {}}
                  onReject={() => {}}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No completed design tasks
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DesignCardProps {
  order: Order;
  completed?: boolean;
  onApprove: (remarks: string) => void;
  onReject: (remarks: string) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  order,
  completed,
  onApprove,
  onReject
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
          {order.designRemarks && (
            <p><strong>Design Notes:</strong> {order.designRemarks}</p>
          )}
          
          {!completed && (
            <>
              <textarea
                placeholder="Add remarks"
                className="w-full border rounded p-2 h-24"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onApprove(remarks)}
                  className="flex-1"
                  variant="default"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => onReject(remarks)}
                  className="flex-1"
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignDashboard;
