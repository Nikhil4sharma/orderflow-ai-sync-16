
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheck, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Order } from "@/types";

const StatusSummaryCard: React.FC = () => {
  const { orders, currentUser } = useOrders();

  // Filter orders for the current user's department
  const departmentOrders = orders.filter(order => {
    // Admin can see all orders
    if (currentUser?.role === 'Admin') return true;
    
    // Department specific filtering
    return order.currentDepartment === currentUser?.department;
  });

  // Count by status
  const countByStatus = (status: string) => {
    return departmentOrders.filter(order => order.status === status).length;
  };

  const getStatusCounts = () => {
    return {
      new: countByStatus("New"),
      inProgress: countByStatus("In Progress"),
      pending: countByStatus("On Hold"),
      completed: countByStatus("Completed")
    };
  };

  const statusCounts = getStatusCounts();

  // Status display configurations
  const statusItems = [
    {
      name: "New Orders",
      count: statusCounts.new,
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      name: "In Progress",
      count: statusCounts.inProgress,
      icon: <Loader2 className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-300"
    },
    {
      name: "On Hold",
      count: statusCounts.pending,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      color: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      name: "Completed",
      count: statusCounts.completed,
      icon: <CircleCheck className="h-5 w-5 text-green-500" />,
      color: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300"
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30 pb-3">
        <CardTitle className="text-xl font-bold">Status Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusItems.map((item) => (
            <div 
              key={item.name} 
              className={`${item.color} p-4 rounded-lg flex flex-col items-center justify-center hover:translate-y-[-2px] transition-transform`}
            >
              <div className="bg-white/50 dark:bg-black/20 p-2 rounded-full mb-2">
                {item.icon}
              </div>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.count}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummaryCard;
