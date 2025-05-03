
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Department, Order } from "@/types";
import { getNextDepartment } from "@/lib/mock-data";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface ForwardOrderFormProps {
  order: Order;
  onForward?: () => void;
}

const ForwardOrderForm: React.FC<ForwardOrderFormProps> = ({ order, onForward }) => {
  const { updateOrder, addStatusUpdate } = useOrders();
  const [remarks, setRemarks] = useState<string>("");
  
  const nextDepartment = getNextDepartment(order.currentDepartment);
  
  if (!nextDepartment) {
    return (
      <Card className="glass-card">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="flex items-center">
            <ArrowRight className="h-5 w-5 mr-2" /> 
            Forward Order
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            This order is in the final department and cannot be forwarded.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const handleForward = () => {
    // Update the order with the new department
    const updatedOrder = { 
      ...order, 
      currentDepartment: nextDepartment,
      status: "New" // Reset status when forwarding to a new department
    };
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: order.currentDepartment,
      status: `Forwarded to ${nextDepartment}`,
      remarks: remarks
    });
    
    toast.success(`Order forwarded to ${nextDepartment}`);
    
    if (onForward) {
      onForward();
    }
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2" /> 
          Forward to {nextDepartment}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="forward-remarks"
              className="block text-sm font-medium leading-6"
            >
              Handover Remarks
            </label>
            <div className="mt-2">
              <Textarea
                id="forward-remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={`Add any notes for the ${nextDepartment} team...`}
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            className="w-full"
            onClick={handleForward}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Forward to {nextDepartment}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForwardOrderForm;
