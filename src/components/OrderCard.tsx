
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Order } from "@/types";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, FileText, ArrowRight, IndianRupee } from "lucide-react";
import { formatIndianRupees } from "@/lib/utils";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Sales': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
      case 'Design': return 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300';
      case 'Prepress': return 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300';
      case 'Production': return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
      case 'Partial': return 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300';
      case 'Not Paid': return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    // Implement the logic to update the order status
    // After updating the status, notify the user
    await notifyOrderStatusChanged(order.id, order.orderNumber, newStatus, order.currentDepartment);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow animate-fade-in hover:border-primary/20 overflow-hidden">
      <div className={`h-1.5 ${order.status === "Completed" ? "bg-green-500" : order.status === "Issue" ? "bg-red-500" : "bg-blue-500"}`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              {order.clientName}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Department:</p>
            <Badge variant="outline" className={`${getDepartmentColor(order.currentDepartment)}`}>
              {order.currentDepartment}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Payment:</p>
            <Badge variant="outline" className={`${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Created: </span>
            <span className="font-medium ml-1">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="font-medium">{formatIndianRupees(order.amount)}</span>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-muted-foreground text-xs mb-1">Items:</p>
          <div className="flex flex-wrap gap-1">
            {order.items.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="bg-brand-lightBlue/10 text-brand-blue dark:bg-brand-lightBlue/5 text-xs">
                {item}
              </Badge>
            ))}
            {order.items.length > 3 && (
              <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                +{order.items.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-xs justify-between hover:bg-primary/5"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
