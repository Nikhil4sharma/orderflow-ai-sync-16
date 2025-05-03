
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Department, DesignStatus, Order, PrepressStatus } from "@/types";
import { format } from "date-fns";
import TimeEstimationInput from "./TimeEstimationInput";

interface DepartmentStatusFormProps {
  order: Order;
  department: Department;
}

const DepartmentStatusForm: React.FC<DepartmentStatusFormProps> = ({ order, department }) => {
  const { updateOrder, addStatusUpdate } = useOrders();
  
  // Form state based on department
  const [status, setStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  
  const getStatusOptions = () => {
    switch (department) {
      case 'Design':
        return ['Working on it', 'Pending Feedback from Sales Team', 'Forwarded to Prepress'];
      case 'Prepress':
        return ['Waiting for approval', 'Forwarded to production', 'Working on it'];
      case 'Production':
        return ['In Progress', 'On Hold', 'Completed', 'Issue'];
      default:
        return ['In Progress', 'On Hold', 'Completed', 'Issue'];
    }
  };
  
  const handleSubmit = () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    
    // Validate timeline
    if (!estimatedTime) {
      toast.error("Please provide an estimated time for completion");
      return;
    }
    
    const updatedOrder = { ...order };
    
    // Update department-specific fields
    switch (department) {
      case 'Design':
        updatedOrder.designStatus = status as DesignStatus;
        updatedOrder.designRemarks = remarks;
        break;
      case 'Prepress':
        updatedOrder.prepressStatus = status as PrepressStatus;
        updatedOrder.prepressRemarks = remarks;
        break;
      case 'Production':
        // For production, we'd typically update a specific stage
        break;
      default:
        // General status update
        updatedOrder.status = status as any;
    }
    
    // Update general order status
    if (['Completed', 'Ready', 'Forwarded to Prepress', 'Forwarded to production'].includes(status)) {
      updatedOrder.status = 'Completed';
    } else if (['Working on it', 'In Progress', 'Waiting for approval'].includes(status)) {
      updatedOrder.status = 'In Progress';
    }
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: department,
      status: status,
      remarks: remarks,
      estimatedTime: estimatedTime
    });
    
    toast.success("Status updated successfully");
    
    // Reset form
    setRemarks("");
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          Update {department} Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium leading-6"
            >
              Status
            </label>
            <div className="mt-2">
              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${department} status`} />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <TimeEstimationInput 
              value={estimatedTime}
              onChange={setEstimatedTime}
              required={true}
            />
          </div>
          
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium leading-6"
            >
              Remarks
            </label>
            <div className="mt-2">
              <Textarea
                id="remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add notes about current status..."
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleSubmit}
            className="w-full mt-4"
          >
            Update Status
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatusForm;
