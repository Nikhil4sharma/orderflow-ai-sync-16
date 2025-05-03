
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ApprovalsList: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const navigate = useNavigate();

  // Filter orders that need approval from Sales team
  const ordersNeedingApproval = orders.filter((order) => {
    // Check for design team approval requests
    const designNeedsApproval = 
      order.currentDepartment === 'Design' && 
      order.designStatus === 'Pending Feedback from Sales Team';
    
    // Check for prepress team approval requests
    const prepressNeedsApproval = 
      order.currentDepartment === 'Prepress' && 
      order.prepressStatus === 'Waiting for approval';
    
    return designNeedsApproval || prepressNeedsApproval;
  });

  if (ordersNeedingApproval.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Orders Awaiting Your Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
            <p>No orders currently need your approval.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...ordersNeedingApproval].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <CardHeader className="bg-amber-50 dark:bg-amber-950/20 border-b">
        <CardTitle className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Orders Awaiting Your Approval ({sortedOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedOrders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-muted/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">{order.clientName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(order.createdAt), 'MMM d, yyyy')}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${
                      order.designStatus === 'Pending Feedback from Sales Team' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50' 
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}
                  >
                    {order.designStatus === 'Pending Feedback from Sales Team' 
                      ? 'Design Approval' 
                      : 'Prepress Approval'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> 
                  View & Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalsList;
