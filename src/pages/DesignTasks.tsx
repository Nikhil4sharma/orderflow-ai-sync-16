
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { Layout } from "lucide-react";

const DesignTasks: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const navigate = useNavigate();
  
  // Filter orders for Design department
  const designTasks = orders.filter(order => 
    order.currentDepartment === "Design" || 
    (currentUser?.role === "Admin" && order.designStatus !== undefined)
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Design Tasks</h1>
          <p className="text-muted-foreground">Manage all design tasks and requests</p>
        </div>
      </div>
      
      {designTasks.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Layout className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No design tasks found</h3>
            <p className="text-muted-foreground text-center mt-2">
              There are currently no tasks assigned to the Design department.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designTasks.map((task) => (
            <Card key={task.id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{task.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{task.clientName}</p>
                  </div>
                  <StatusBadge status={task.designStatus || task.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm mb-4">
                  <p className="line-clamp-2">{task.requirements || "No specific design requirements provided."}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/orders/${task.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignTasks;
