
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Order } from "@/types";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow animate-fade-in glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">{order.clientName}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div>
            <p className="text-muted-foreground">Department:</p>
            <p>{order.currentDepartment}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created:</p>
            <p>{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-muted-foreground text-sm mb-1">Items:</p>
          <div className="flex flex-wrap gap-1">
            {order.items.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-brand-lightBlue">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
