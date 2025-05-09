import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheck, Clock, AlertTriangle, Loader2, CheckCircle2, PauseCircle, AlertCircle } from "lucide-react";
import { Order } from "@/types";
import CountUp from "react-countup";

const getLastWeekCount = (orders, status) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  return orders.filter(order => order.status === status && new Date(order.createdAt) > lastWeek).length;
};

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

  // Last week counts for % change
  const lastWeekCounts = {
    "New": getLastWeekCount(departmentOrders, "New"),
    "In Progress": getLastWeekCount(departmentOrders, "In Progress"),
    "On Hold": getLastWeekCount(departmentOrders, "On Hold"),
    "Completed": getLastWeekCount(departmentOrders, "Completed"),
    "Pending Approval": getLastWeekCount(departmentOrders, "Pending Approval"),
    "Issue": getLastWeekCount(departmentOrders, "Issue"),
    "Ready to Dispatch": getLastWeekCount(departmentOrders, "Ready to Dispatch"),
  };

  const getStatusCounts = () => {
    return {
      new: countByStatus("New"),
      inProgress: countByStatus("In Progress"),
      pending: countByStatus("On Hold"),
      completed: countByStatus("Completed"),
      pendingApproval: countByStatus("Pending Approval"),
      issue: countByStatus("Issue"),
      readyToDispatch: countByStatus("Ready to Dispatch"),
    };
  };

  const statusCounts = getStatusCounts();

  // Status display configurations
  const statusItems = [
    {
      name: "New Orders",
      count: statusCounts.new,
      lastWeek: lastWeekCounts["New"],
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      name: "In Progress",
      count: statusCounts.inProgress,
      lastWeek: lastWeekCounts["In Progress"],
      icon: <Loader2 className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-300"
    },
    {
      name: "On Hold",
      count: statusCounts.pending,
      lastWeek: lastWeekCounts["On Hold"],
      icon: <PauseCircle className="h-5 w-5 text-red-500" />,
      color: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      name: "Completed",
      count: statusCounts.completed,
      lastWeek: lastWeekCounts["Completed"],
      icon: <CircleCheck className="h-5 w-5 text-green-500" />,
      color: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300"
    },
    {
      name: "Pending Approval",
      count: statusCounts.pendingApproval,
      lastWeek: lastWeekCounts["Pending Approval"],
      icon: <CheckCircle2 className="h-5 w-5 text-cyan-500" />,
      color: "bg-cyan-100 dark:bg-cyan-900/20",
      textColor: "text-cyan-700 dark:text-cyan-300"
    },
    {
      name: "Issues",
      count: statusCounts.issue,
      lastWeek: lastWeekCounts["Issue"],
      icon: <AlertCircle className="h-5 w-5 text-pink-500" />,
      color: "bg-pink-100 dark:bg-pink-900/20",
      textColor: "text-pink-700 dark:text-pink-300"
    },
    {
      name: "Ready to Dispatch",
      count: statusCounts.readyToDispatch,
      lastWeek: lastWeekCounts["Ready to Dispatch"],
      icon: <CheckCircle2 className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300"
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30 pb-3">
        <CardTitle className="text-xl font-bold">Status Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          {statusItems.map((item) => {
            // % change calculation
            const percentChange = item.lastWeek === 0 ? 0 : ((item.count - item.lastWeek) / (item.lastWeek || 1)) * 100;
            return (
              <div 
                key={item.name} 
                className={`${item.color} p-4 rounded-lg flex flex-col items-center justify-center hover:scale-[1.04] transition-transform shadow-lg glass-card`}
              >
                <div className="bg-white/50 dark:bg-black/20 p-2 rounded-full mb-2">
                  {item.icon}
                </div>
                <div className={`text-2xl font-bold ${item.textColor} flex items-center gap-2`}>
                  <CountUp end={item.count} duration={1.2} />
                  {percentChange !== 0 && (
                    <span className={`text-xs ml-1 ${percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}%</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummaryCard;
