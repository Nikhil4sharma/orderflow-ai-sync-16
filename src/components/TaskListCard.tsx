
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { ClipboardList, Clock } from "lucide-react";
import { Order, OrderStatus } from "@/types";

const TaskListCard: React.FC = () => {
  const { orders, currentUser } = useOrders();

  // Get pending orders for the current department
  const getDepartmentTasks = () => {
    if (!currentUser) return [];

    return orders.filter(order => {
      if (currentUser.role === "Admin") {
        // Use "In Progress" instead of "New" to match the OrderStatus type
        return order.status === "In Progress";
      }

      return (
        order.currentDepartment === currentUser.department &&
        // Use "In Progress" instead of "New"
        order.status === "In Progress"
      );
    });
  };

  const pendingTasks = getDepartmentTasks();

  // Sort tasks by urgency/priority (here we're using creation date as a proxy)
  const sortedTasks = [...pendingTasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get task description based on department and order status
  const getTaskDescription = (order: Order) => {
    switch (currentUser?.department) {
      case "Sales":
        // Change "New" to "In Progress"
        if (order.status === "In Progress") return "Process new order";
        if (order.paymentStatus !== "Paid") return "Collect payment";
        return "Follow-up required";
      
      case "Design":
        if (order.designStatus === "Working on it") return "Design in progress";
        return "Start design work";
      
      case "Prepress":
        if (order.prepressStatus === "Working on it") return "Prepress in progress";
        return "Start prepress work";
      
      case "Production":
        return "Production required";
      
      default:
        return "Action required";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedTasks.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox id={`task-${task.id}`} className="mt-0.5" />
                  <div className="flex-1">
                    <label htmlFor={`task-${task.id}`} className="flex items-center font-medium cursor-pointer">
                      <Link to={`/orders/${task.id}`} className="hover:underline">
                        {task.orderNumber}: {task.clientName}
                      </Link>
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getTaskDescription(task)}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-background">
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No pending tasks</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskListCard;
