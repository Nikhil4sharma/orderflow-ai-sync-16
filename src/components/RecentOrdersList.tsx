
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, FileText } from "lucide-react";
import { formatIndianRupees } from "@/lib/utils";

const RecentOrdersList: React.FC = () => {
  const { orders, currentUser } = useOrders();

  // Filter orders for the current user's department
  const departmentOrders = orders.filter(order => {
    // Admin can see all orders
    if (currentUser?.role === 'Admin') return true;
    
    // Department specific filtering
    return order.currentDepartment === currentUser?.department;
  });

  // Sort orders by creation date (newest first) and take the first 5
  const recentOrders = [...departmentOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Function to get badge variant based on order status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "In Progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "On Hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Dispatched":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">{order.clientName}</div>
                  </div>
                  <div className="text-right">
                    {currentUser?.department === 'Sales' || currentUser?.role === 'Admin' ? (
                      <div className="font-medium">{formatIndianRupees(order.amount)}</div>
                    ) : null}
                    <Badge
                      variant="outline"
                      className={`mt-1 ${getBadgeVariant(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to={`/orders/${order.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No recent orders found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersList;
