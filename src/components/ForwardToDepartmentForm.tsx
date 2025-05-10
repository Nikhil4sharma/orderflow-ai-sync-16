
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Department, Order, OrderStatus } from "@/types";
import { canForwardToDepartment } from "@/lib/permissions";
import ManualTimeEstimationInput from "./ManualTimeEstimationInput";

interface ForwardToDepartmentFormProps {
  order: Order;
  targetDepartment: Department;
}

const ForwardToDepartmentForm: React.FC<ForwardToDepartmentFormProps> = ({ order, targetDepartment }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  const [remarks, setRemarks] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  
  if (!currentUser || !canForwardToDepartment(currentUser, order.currentDepartment, targetDepartment)) {
    return null;
  }
  
  const handleForward = () => {
    if (!remarks) {
      toast.error("Please provide handover details");
      return;
    }
    
    if (!estimatedTime) {
      toast.error("Please provide estimated completion time");
      return;
    }
    
    // Update the order
    const updatedOrder = {
      ...order,
      currentDepartment: targetDepartment,
      status: "In Progress" as OrderStatus,
    };
    
    // Handle department-specific status updates
    if (order.currentDepartment === 'Design' && targetDepartment === 'Prepress') {
      updatedOrder.designStatus = 'Forwarded to Prepress';
    } else if (order.currentDepartment === 'Prepress' && targetDepartment === 'Production') {
      updatedOrder.prepressStatus = 'Forwarded to production';
    }
    
    updateOrder(updatedOrder);
    
    // Add status update with proper OrderStatus type
    const forwardStatus = `Forwarded to ${targetDepartment}` as OrderStatus;
    addStatusUpdate(order.id, {
      department: currentUser.department,
      status: forwardStatus,
      remarks: remarks,
      estimatedTime: estimatedTime
    });
    
    toast.success(`Order forwarded to ${targetDepartment} team`);
    
    // Reset form
    setRemarks("");
    setEstimatedTime("");
  };
  
  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="h-5 w-5 mr-2" />
          Forward to {targetDepartment} Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <ManualTimeEstimationInput
            value={estimatedTime}
            onChange={setEstimatedTime}
            required
          />
          
          <div>
            <label
              htmlFor="forward-remarks"
              className="block text-sm font-medium leading-6"
            >
              Handover Details
            </label>
            <div className="mt-2">
              <Textarea
                id="forward-remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={`Provide details for the ${targetDepartment} team...`}
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleForward}
            className="w-full"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Forward to {targetDepartment}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForwardToDepartmentForm;
